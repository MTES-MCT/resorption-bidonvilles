import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `services/action/exportActions.ts` (nouveau contrat « filtres de la liste + fraîcheur »).
 *
 *   exportActions(user, year, filters: ReportFilters = {})
 *
 *  1. permissions inchangées (export action, filtres territoriaux, finances) ;
 *  2. now = new Date() (une seule fois) ;
 *  3. actionModel.fetchReport(year, actionClauseGroup, financeClauseGroup, filters, now) ;
 *  4. si au moins une ligne : actionModel.fetchMetrics(ids des lignes) en UNE requête ; aucun appel sans ligne ;
 *  5. pour chaque ligne : lignes de fraîcheur = toFreshnessRow(m) pour chaque ligne de métriques de l'action, puis
 *     computeActionFreshness(row.started_on, row.ended_on, freshnessRows, now) ; pose sur la ligne
 *     is_active_previous_year, indicators_up_to_date_90d, indicators_up_to_date_180d ;
 *  6. plus de filtre local sur finance_dedie ; 7. generateExportFile(rows, year, ...) comme avant.
 *
 * Fichier séparé de exportActions.spec.ts : l'ancien spec fige un double de `actionModel` qui n'expose que
 * `fetchReport` (voir le compte rendu), il ne peut pas servir au nouveau contrat sans être modifié.
 * Les deux modules de fraîcheur (`models/actionModel/_common/toFreshnessRow`, `computeActionFreshness`) sont des
 * doubles : leur logique est testée dans leurs propres specs.
 */
const sandbox = sinon.createSandbox();

const stubs = {
    getPermission: sandbox.stub(),
    where: sandbox.stub(),
    fetchReport: sandbox.stub(),
    fetchMetrics: sandbox.stub(),
    generateExportFile: sandbox.stub(),
    toFreshnessRow: sandbox.stub(),
    computeActionFreshness: sandbox.stub(),
    doClause: sandbox.stub(),
};

rewiremock('#server/utils/permission').with({
    getPermission: stubs.getPermission,
    where: stubs.where,
});
rewiremock('#server/models/actionModel').with({
    fetchReport: stubs.fetchReport,
    fetchMetrics: stubs.fetchMetrics,
});
rewiremock('./exportActions.generateExportFile').with(stubs.generateExportFile);
rewiremock('#server/models/actionModel/_common/toFreshnessRow').with(stubs.toFreshnessRow);
rewiremock('#server/models/actionModel/_common/computeActionFreshness').with(stubs.computeActionFreshness);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import exportActions from './exportActions';
rewiremock.disable();

type FakeRow = { action_id: number, started_on: Date, ended_on: Date | null, finance_dedie?: number | null };
type FakeMetric = { action_id: number, label: string };

function buildRow(actionId: number, override: Partial<FakeRow> = {}): FakeRow {
    return {
        action_id: actionId,
        started_on: new Date(2024, 0, actionId),
        ended_on: null,
        finance_dedie: null,
        ...override,
    };
}

describe('services/action/exportActions() - filtres de la liste et fraîcheur des indicateurs', () => {
    const year = '2025';
    const actionClauseGroup = { regions: { query: 'regions.code', value: ['11'] } };
    const financeClauseGroup = { regions: { query: 'regions.code', value: ['11'] } };
    let user;

    beforeEach(() => {
        sandbox.reset();
        user = fakeUser();

        stubs.doClause.withArgs('read', 'action').returns(actionClauseGroup);
        stubs.doClause.withArgs('access', 'action_finances').returns(financeClauseGroup);
        stubs.where.returns({ can: sandbox.stub().returns({ do: stubs.doClause }) });
        stubs.getPermission.returns('allowed');

        stubs.fetchReport.resolves([buildRow(1), buildRow(2)]);
        stubs.fetchMetrics.resolves([]);
        stubs.generateExportFile.resolves(Buffer.from('excel file'));
        stubs.toFreshnessRow.callsFake((metric: FakeMetric) => ({ fresh: metric.label }));
        stubs.computeActionFreshness.returns({ isActivePreviousYear: false, isUpToDate90Days: false, isUpToDate180Days: false });
    });

    after(() => {
        sandbox.restore();
    });

    describe('transmission des filtres', () => {
        it('transmet l\'année, les clauses de permission, les filtres et la date du jour à fetchReport', async () => {
            const filters = { status: 'open' as const, topic: ['health'], dihalFinancing: ['all'] };
            const before = Date.now();

            await exportActions(user, year, filters);

            const after = Date.now();
            expect(stubs.fetchReport).to.have.been.calledOnce;
            const [fetchedYear, actionClause, financeClause, passedFilters, now] = stubs.fetchReport.firstCall.args;
            expect(fetchedYear).to.equal(2025);
            expect(actionClause).to.equal(actionClauseGroup);
            expect(financeClause).to.equal(financeClauseGroup);
            expect(passedFilters).to.equal(filters);
            expect(now).to.be.instanceOf(Date);
            expect(now.getTime()).to.be.within(before, after);
        });

        it('utilise des filtres vides quand ils ne sont pas fournis', async () => {
            await exportActions(user, year);

            expect(stubs.fetchReport.firstCall.args[3]).to.deep.equal({});
        });

        it('transmet financeClauseGroup à null quand l\'utilisateur n\'a pas accès aux financements', async () => {
            stubs.doClause.withArgs('access', 'action_finances').returns(null);

            await exportActions(user, year, { dihalFinancing: ['all'] });

            expect(stubs.fetchReport.firstCall.args[2]).to.equal(null);
        });
    });

    describe('métriques et fraîcheur', () => {
        it('charge les métriques des actions du rapport en une seule requête', async () => {
            stubs.fetchReport.resolves([buildRow(3), buildRow(5), buildRow(9)]);

            await exportActions(user, year);

            expect(stubs.fetchMetrics).to.have.been.calledOnce;
            expect(stubs.fetchMetrics.firstCall.args[0]).to.deep.equal([3, 5, 9]);
        });

        it('n\'appelle pas fetchMetrics quand le rapport est vide, et lève no_action_to_export', async () => {
            stubs.fetchReport.resolves([]);

            try {
                await exportActions(user, year, { topic: ['health'] });
                expect.fail('aurait dû lever une ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('no_action_to_export');
            }
            expect(stubs.fetchMetrics).to.not.have.been.called;
            expect(stubs.generateExportFile).to.not.have.been.called;
        });

        it('lève no_action_to_export (et non fetch_failed) pour un rapport vide sans filtre', async () => {
            stubs.fetchReport.resolves([]);

            try {
                await exportActions(user, year);
                expect.fail('aurait dû lever une ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('no_action_to_export');
                expect(error.code).to.not.equal('fetch_failed');
            }
        });

        it('transforme chaque ligne de métriques de l\'action avec toFreshnessRow puis appelle computeActionFreshness', async () => {
            const row1 = buildRow(1, { started_on: new Date(2023, 0, 1), ended_on: new Date(2026, 5, 30) });
            const row2 = buildRow(2);
            const metrics: FakeMetric[] = [
                { action_id: 1, label: 'a1-2024' },
                { action_id: 2, label: 'a2-2025' },
                { action_id: 1, label: 'a1-2025' },
            ];
            stubs.fetchReport.resolves([row1, row2]);
            stubs.fetchMetrics.resolves(metrics);

            await exportActions(user, year);

            const now = stubs.fetchReport.firstCall.args[4];
            expect(stubs.toFreshnessRow).to.have.callCount(3);
            expect(stubs.computeActionFreshness).to.have.callCount(2);
            expect(stubs.computeActionFreshness).to.have.been.calledWith(
                row1.started_on,
                row1.ended_on,
                [{ fresh: 'a1-2024' }, { fresh: 'a1-2025' }],
            );
            expect(stubs.computeActionFreshness).to.have.been.calledWith(row2.started_on, null, [{ fresh: 'a2-2025' }]);
            // même date de référence que pour la requête du rapport
            stubs.computeActionFreshness.getCalls().forEach((call) => {
                expect(call.args[3]).to.be.instanceOf(Date);
                expect(call.args[3].getTime()).to.equal(now.getTime());
            });
        });

        it('passe un tableau vide à computeActionFreshness pour une action sans métriques', async () => {
            stubs.fetchReport.resolves([buildRow(1)]);
            stubs.fetchMetrics.resolves([]);

            await exportActions(user, year);

            expect(stubs.computeActionFreshness.firstCall.args[2]).to.deep.equal([]);
        });

        it('pose les trois booléens calculés sur chaque ligne transmise à la génération', async () => {
            stubs.fetchReport.resolves([buildRow(1), buildRow(2), buildRow(3)]);
            stubs.computeActionFreshness.callsFake((startedOn: Date) => {
                const day = startedOn.getDate();
                if (day === 1) {
                    return { isActivePreviousYear: true, isUpToDate90Days: true, isUpToDate180Days: true };
                }
                if (day === 2) {
                    return { isActivePreviousYear: true, isUpToDate90Days: false, isUpToDate180Days: true };
                }
                return { isActivePreviousYear: false, isUpToDate90Days: false, isUpToDate180Days: false };
            });

            await exportActions(user, year);

            const rows = stubs.generateExportFile.firstCall.args[0];
            expect(rows).to.have.lengthOf(3);
            expect(rows[0]).to.include({
                action_id: 1, is_active_previous_year: true, indicators_up_to_date_90d: true, indicators_up_to_date_180d: true,
            });
            expect(rows[1]).to.include({
                action_id: 2, is_active_previous_year: true, indicators_up_to_date_90d: false, indicators_up_to_date_180d: true,
            });
            expect(rows[2]).to.include({
                action_id: 3, is_active_previous_year: false, indicators_up_to_date_90d: false, indicators_up_to_date_180d: false,
            });
        });

        it('lève fetch_failed si la lecture des métriques échoue, sans générer le fichier', async () => {
            stubs.fetchMetrics.rejects(new Error('boom'));

            try {
                await exportActions(user, year);
                expect.fail('aurait dû lever une ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('fetch_failed');
            }
            expect(stubs.generateExportFile).to.not.have.been.called;
        });
    });

    describe('suppression du filtre local sur finance_dedie', () => {
        it('conserve toutes les lignes du rapport même sans financement dédié, quel que soit le filtre dihalFinancing', async () => {
            stubs.fetchReport.resolves([
                buildRow(1, { finance_dedie: null }),
                buildRow(2, { finance_dedie: 0 }),
                buildRow(3, { finance_dedie: 1000 }),
            ]);

            await exportActions(user, year, { dihalFinancing: ['all'] });

            const rows = stubs.generateExportFile.firstCall.args[0];
            expect(rows.map(row => row.action_id)).to.deep.equal([1, 2, 3]);
        });
    });

    describe('enchaînement', () => {
        it('lit le rapport, puis les métriques, puis génère le fichier avec les paramètres habituels', async () => {
            await exportActions(user, year, { status: 'closed' });

            expect(stubs.fetchReport).to.have.been.calledBefore(stubs.fetchMetrics);
            expect(stubs.fetchMetrics).to.have.been.calledBefore(stubs.generateExportFile);
            const { args } = stubs.generateExportFile.firstCall;
            expect(args[1]).to.equal(2025);
            expect(args[2]).to.equal(true); // includeFinances
            expect(args[4]).to.equal(null); // allowedFinanceActions
        });

        it('transmet à generateExportFile la même date de référence que celle passée à fetchReport', async () => {
            await exportActions(user, year, { status: 'closed' });

            const fetchReportNow = stubs.fetchReport.firstCall.args[4];
            const generateNow = stubs.generateExportFile.firstCall.args[5];
            expect(generateNow).to.be.instanceOf(Date);
            expect(generateNow).to.equal(fetchReportNow);
        });

        it('retourne le buffer généré', async () => {
            const buffer = Buffer.from('xlsx');
            stubs.generateExportFile.resolves(buffer);

            expect(await exportActions(user, year)).to.equal(buffer);
        });

        it('utilise l\'année précédente quand l\'année est vide', async () => {
            await exportActions(user, '');

            expect(stubs.fetchReport.firstCall.args[0]).to.equal(new Date().getFullYear() - 1);
        });
    });

    describe('permissions et erreurs inchangées', () => {
        it('lève permission_denied sans permission d\'export, sans rien lire', async () => {
            stubs.getPermission.returns(null);

            try {
                await exportActions(user, year, { status: 'open' });
                expect.fail('aurait dû lever une ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('permission_denied');
            }
            expect(stubs.fetchReport).to.not.have.been.called;
            expect(stubs.fetchMetrics).to.not.have.been.called;
        });

        it('lève permission_denied sans accès en lecture aux actions, sans rien lire', async () => {
            stubs.doClause.withArgs('read', 'action').returns(null);

            try {
                await exportActions(user, year);
                expect.fail('aurait dû lever une ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('permission_denied');
            }
            expect(stubs.fetchReport).to.not.have.been.called;
        });

        it('lève fetch_failed quand fetchReport échoue', async () => {
            stubs.fetchReport.rejects(new Error('boom'));

            try {
                await exportActions(user, year);
                expect.fail('aurait dû lever une ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('fetch_failed');
            }
        });

        it('lève export_failed quand la génération du fichier échoue', async () => {
            stubs.generateExportFile.rejects(new Error('boom'));

            try {
                await exportActions(user, year);
                expect.fail('aurait dû lever une ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('export_failed');
            }
        });
    });
});
