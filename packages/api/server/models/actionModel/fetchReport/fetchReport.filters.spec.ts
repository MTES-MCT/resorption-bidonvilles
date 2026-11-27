import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `fetchReport/fetchReport.ts` (filtres de la liste, lignes de fraîcheur), en complément de
 * fetchReport.spec.ts et fetchReport.metricsVersion.spec.ts. Le SQL n'est pas exécuté (pas de base) : on vérifie le
 * texte de la requête et les remplacements, comme le font les specs voisins. Les fragments eux-mêmes sont testés dans
 * buildReportFilters.spec.ts ; ici `buildReportFilters` est un double.
 *
 * Signature : fetchReport(requestedYear, actionClauseGroup = {}, financeClauseGroup = {}, filters = {}, now = new Date())
 *  - délègue à buildReportFilters(filters, now) et ajoute ses fragments (joints par AND) à la clause WHERE principale ;
 *    ses remplacements sont fusionnés à `annee`, `action_*` et `finance_*` ;
 *  - expose par ligne `action_id`, `started_on` (actions.started_at), `ended_on` (actions.ended_at) sans toucher aux
 *    colonnes texte `started_at` / `ended_at`, et `has_dihal_financing` (au moins une ligne dedie, toute année ; NULL
 *    sans accès aux financements) ;
 *  - la CTE `action_operators` (agrégat de noms) est renommée : elle masquait la vraie table `action_operators`
 *    utilisée par les sous-requêtes EXISTS des filtres (structure, recherche) ;
 *  - permissions de financement : sans accès (financeClauseGroup === null) un filtre `dihalFinancing` ne doit rien
 *    révéler -> aucune ligne (FALSE dans la clause principale) ; avec un accès territorial, la clause de financement
 *    (`finance_*`) est aussi appliquée à la clause principale quand `dihalFinancing` est actif.
 */
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: { query: sandbox.stub() },
    buildReportFilters: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
rewiremock('../fetch/enrichWhere').callThrough();
rewiremock.passBy(/metricsVersionKey/);
rewiremock('./buildReportFilters').with(stubs.buildReportFilters);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetchReport from './fetchReport';
rewiremock.disable();

const YEAR = 2025;
const NOW = new Date(2026, 10, 26, 10, 0, 0, 0);

const lastSql = (): string => stubs.sequelize.query.lastCall.args[0].replace(/\s+/g, ' ');
const lastReplacements = (): Record<string, unknown> => stubs.sequelize.query.lastCall.args[1].replacements;
// Clause WHERE de la requête principale (après la jointure des CTE)
const mainWhere = (): string => {
    const sql = lastSql();
    return sql.slice(sql.lastIndexOf('actions.started_at <='));
};

describe('models/actionModel/fetchReport/fetchReport() - filtres et fraîcheur', () => {
    beforeEach(() => {
        stubs.sequelize.query.resolves([]);
        stubs.buildReportFilters.returns({ where: [], replacements: {} });
    });

    afterEach(() => {
        sandbox.reset();
    });

    describe('délégation à buildReportFilters', () => {
        it('appelle buildReportFilters avec les filtres et la date fournis', async () => {
            const filters = { status: 'open' as const, topic: ['health'] };

            await fetchReport(YEAR, {}, {}, filters, NOW);

            expect(stubs.buildReportFilters).to.have.been.calledOnceWithExactly(filters, NOW);
        });

        it('utilise {} et la date courante par défaut', async () => {
            const before = Date.now();

            await fetchReport(YEAR);

            const after = Date.now();
            const [filters, now] = stubs.buildReportFilters.firstCall.args;
            expect(filters).to.deep.equal({});
            expect(now).to.be.instanceOf(Date);
            expect(now.getTime()).to.be.within(before, after);
        });

        it('ajoute les fragments (joints par AND) à la clause WHERE principale', async () => {
            stubs.buildReportFilters.returns({
                where: ['FRAGMENT_A = 1', '(FRAGMENT_B OR FRAGMENT_C)'],
                replacements: {},
            });

            await fetchReport(YEAR, {}, {}, { status: 'open' }, NOW);

            const where = mainWhere();
            expect(where).to.include('AND FRAGMENT_A = 1 AND (FRAGMENT_B OR FRAGMENT_C)');
            expect(where.indexOf('FRAGMENT_A')).to.be.greaterThan(where.indexOf('actions.ended_at IS NULL OR actions.ended_at >='));
            expect(where.indexOf('FRAGMENT_A')).to.be.lessThan(where.indexOf('ORDER BY'));
        });

        it('fusionne les remplacements des filtres avec annee et ceux des permissions', async () => {
            stubs.buildReportFilters.returns({ where: ['x = :filter_a'], replacements: { filter_a: 'valeur' } });

            await fetchReport(
                YEAR,
                { regions: { query: 'regions.code', value: ['11'] } },
                { actions: { query: 'actions.action_id', value: [4, 5] } },
                { search: 'abri' },
                NOW,
            );

            expect(lastReplacements()).to.deep.equal({
                annee: YEAR,
                action_regions: ['11'],
                finance_actions: [4, 5],
                filter_a: 'valeur',
            });
        });

        it('n\'ajoute aucune condition quand il n\'y a aucun fragment', async () => {
            await fetchReport(YEAR, {}, {}, {}, NOW);

            const where = mainWhere();
            const afterDates = where.slice(where.indexOf('actions.ended_at IS NULL OR actions.ended_at >='));
            expect(afterDates).to.match(/^actions\.ended_at IS NULL OR actions\.ended_at >= TO_DATE\(:annee::varchar \|\| '-01-01', 'YYYY-MM-DD'\)\) ORDER BY/);
        });

        it('ne place jamais une valeur saisie dans le SQL (tout passe par les remplacements)', async () => {
            stubs.buildReportFilters.returns({ where: ['actions.name ILIKE :filter_search'], replacements: { filter_search: '%x%' } });

            await fetchReport(YEAR, {}, {}, { search: 'x' }, NOW);

            expect(lastSql()).to.not.include('%x%');
        });
    });

    describe('permissions de financement et filtre dihalFinancing', () => {
        it('sans accès aux financements, un filtre dihalFinancing ne renvoie aucune ligne', async () => {
            stubs.buildReportFilters.returns({ where: ['DIHAL_FRAGMENT'], replacements: {} });

            await fetchReport(YEAR, {}, null, { dihalFinancing: ['all'] }, NOW);

            expect(mainWhere()).to.match(/\bFALSE\b/);
        });

        it('sans accès aux financements et sans filtre dihalFinancing, n\'ajoute pas de FALSE', async () => {
            await fetchReport(YEAR, {}, null, { topic: ['health'] }, NOW);

            expect(mainWhere()).to.not.match(/\bFALSE\b/);
        });

        it('avec un accès territorial aux financements, applique aussi cette restriction à la clause principale', async () => {
            stubs.buildReportFilters.returns({ where: ['DIHAL_FRAGMENT'], replacements: {} });

            await fetchReport(
                YEAR,
                {},
                { regions: { query: 'regions.code', value: ['11'] } },
                { dihalFinancing: ['all'] },
                NOW,
            );

            expect(mainWhere()).to.include('r.code IN (:finance_regions)');
            expect(lastReplacements().finance_regions).to.deep.equal(['11']);
        });

        it('avec un accès restreint à une liste d\'actions, applique aussi cette restriction à la clause principale', async () => {
            stubs.buildReportFilters.returns({ where: ['DIHAL_FRAGMENT'], replacements: {} });

            await fetchReport(
                YEAR,
                {},
                { actions: { query: 'actions.action_id', value: [4, 5] } },
                { dihalFinancing: ['2025'] },
                NOW,
            );

            expect(mainWhere()).to.include('actions.action_id IN (:finance_actions)');
        });

        it('sans filtre dihalFinancing, la restriction de financement n\'est pas ajoutée à la clause principale', async () => {
            await fetchReport(YEAR, {}, { regions: { query: 'regions.code', value: ['11'] } }, { topic: ['health'] }, NOW);

            expect(mainWhere()).to.not.include(':finance_regions');
        });
    });

    describe('colonnes exposées', () => {
        it('expose actions.action_id', async () => {
            await fetchReport(YEAR);

            expect(lastSql()).to.match(/actions\.action_id,/);
        });

        it('expose les vraies dates started_on / ended_on', async () => {
            await fetchReport(YEAR);

            expect(lastSql()).to.match(/actions\.started_at AS "started_on"/);
            expect(lastSql()).to.match(/actions\.ended_at AS "ended_on"/);
        });

        it('conserve les colonnes texte started_at / ended_at', async () => {
            await fetchReport(YEAR);

            expect(lastSql()).to.include('TO_CHAR(started_at, \'DD/MM/YYYY\') AS "started_at"');
            expect(lastSql()).to.include('TO_CHAR(ended_at, \'DD/MM/YYYY\') AS "ended_at"');
        });

        it('expose has_dihal_financing calculé sur les lignes dedie, toute année, quand l\'accès aux financements existe', async () => {
            await fetchReport(YEAR, {}, {});

            const sql = lastSql();
            expect(sql).to.match(/AS "has_dihal_financing"/);
            expect(sql).to.not.include('NULL::boolean AS "has_dihal_financing"');
            expect(sql).to.include('\'dedie\'');
        });

        it('has_dihal_financing vaut NULL sans accès aux financements', async () => {
            await fetchReport(YEAR, {}, null);

            expect(lastSql()).to.include('NULL::boolean AS "has_dihal_financing"');
        });
    });

    describe('CTE action_operators', () => {
        it('ne définit plus de CTE nommée action_operators (elle masquerait la table réelle dans les filtres)', async () => {
            await fetchReport(YEAR);

            expect(lastSql()).to.not.match(/\baction_operators AS \(/);
        });

        it('conserve l\'agrégat des opérateurs sous la colonne operators', async () => {
            await fetchReport(YEAR);

            expect(lastSql()).to.match(/array_agg\(DISTINCT organizations\."name"\) AS operators/);
            expect(lastSql()).to.match(/\boperators,/);
        });
    });
});
