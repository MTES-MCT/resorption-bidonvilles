import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { ActionItem, ActionReportRow } from '#root/types/resources/Action.d';

const { expect } = chai;
chai.use(sinonChai);

// ─── Fixture ActionItem ───────────────────────────────────────────────────────

type ActionItemExtended = ActionItem & { operator_name: string | null; project_name: string };

function buildActionItem(override: Partial<ActionItemExtended> = {}): ActionItemExtended {
    const defaults = {
        departement_name: 'Yvelines',
        region_code: '11',
        region_name: 'Île-De-France',
        action_id: 1,
        action_name: 'Nom action hérité',
        started_at: '01/01/2024',
        ended_at: null,
        location_type: 'Sur site',
        topics: null,
        operators: null,
        goals: 'Des objectifs',
        nombre_personnes: null,
        nombre_menages: null,
        nombre_femmes: null,
        nombre_mineurs: null,
        sante_nombre_personnes: null,
        travail_nombre_personnes: null,
        travail_nombre_femmes: null,
        hebergement_nombre_personnes: null,
        hebergement_nombre_menages: null,
        logement_nombre_personnes: null,
        logement_nombre_menages: null,
        scolaire_mineurs_moins_de_trois_ans: null,
        scolaire_mineurs_trois_ans_et_plus: null,
        scolaire_mediation_moins_de_trois_ans: null,
        scolaire_mediation_trois_ans_et_plus: null,
        scolaire_nombre_maternelle: null,
        scolaire_nombre_elementaire: null,
        scolaire_nombre_college: null,
        scolaire_nombre_lycee: null,
        scolaire_nombre_autre: null,
        scolaire_mineur_scolarise_dans_annee: null,
        finance_etatique: null,
        finance_dedie: null,
        finance_collectivite: null,
        finance_europeen: null,
        finance_prive: null,
        finance_autre: null,
        depense_finance_etatique: null,
        depense_finance_dedie: null,
        depense_finance_collectivite: null,
        depense_finance_europeen: null,
        depense_finance_prive: null,
        depense_finance_autre: null,
        financee_dihal: false,
        comments: null,
        last_comment: null,
        last_comment_date: null,
        last_update: null,
        metrics_updated_at: null,
        // Nouveaux champs attendus après l'évolution
        operator_name: 'Association Solidarité',
        project_name: 'Projet intégration',
    };

    const merged: unknown = Object.assign(defaults, override);
    return merged as ActionItemExtended;
}

type ActionReportRowExtended = ActionReportRow & { operator_name: string | null; project_name: string };

function buildActionReportRow(override: Partial<ActionReportRowExtended> = {}): ActionReportRowExtended {
    const base: unknown = {
        departement_code: '78',
        ...buildActionItem(),
        ...override,
    };
    return base as ActionReportRowExtended;
}

// ─── Fake ExcelJS ─────────────────────────────────────────────────────────────

const sandbox = sinon.createSandbox();
const addRowStub = sandbox.stub();
const mergeCellsStub = sandbox.stub();
const writeBufferStub = sandbox.stub().resolves(Buffer.from([]));

// Valeurs écrites dans les cellules (toutes feuilles confondues) : permet de relire le texte de l'en-tête
const writtenCellValues: unknown[] = [];

// Cellule factice réutilisable
const fakeCell = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentValue: null as any,
    get value() { return this.currentValue; },
    set value(newValue) {
        this.currentValue = newValue;
        writtenCellValues.push(newValue);
    },
    font: {},
    fill: {},
    alignment: {},
    border: {},
};

// Worksheet factice — les méthodes de formatage sont des no-op ou renvoient
// des objets suffisants pour que le code ne plante pas.
function makeFakeWorksheet(name: string = 'Tous') {
    return {
        properties: { defaultColWidth: 0 },
        name,
        addRow: addRowStub,
        mergeCells: mergeCellsStub,
        getCell: () => fakeCell,
        getColumn: () => ({
            width: 0,
            hidden: false,
            eachCell: () => { /* no-op */ },
        }),
        eachRow: () => { /* no-op */ },
        getRow: () => ({
            height: 0,
            eachCell: () => { /* no-op */ },
        }),
        columns: [],
    };
}

class FakeWorkbook {
    xlsx = { writeBuffer: writeBufferStub };

    // Mock d'ExcelJS.Workbook : la méthode ne consomme pas `this` mais doit exister
    // sur l'instance pour satisfaire le contrat `new ExcelJS.Workbook().addWorksheet(...)`.
    // eslint-disable-next-line class-methods-use-this
    addWorksheet(name: string) {
        return makeFakeWorksheet(name);
    }
}

rewiremock('exceljs').with({ Workbook: FakeWorkbook });
rewiremock('#server/errors/ServiceError').callThrough();
rewiremock('#server/utils/departementsOrdonnes').callThrough();
rewiremock('#server/utils/excelUtils').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import exportActions from './exportActions.creerClasseurExcel';
rewiremock.disable();

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Parmi tous les appels addRow, retourne celui dont le premier argument est
 * un tableau de strings (c'est la ligne des labels d'en-têtes de colonnes).
 */
const findHeadersRowCall = () => addRowStub.getCalls().find(
    call => Array.isArray(call.args[0]) && call.args[0].length > 0 && typeof call.args[0][0] === 'string',
);

/**
 * Retourne le premier appel addRow qui suit la ligne des labels
 * (c'est la première ligne de données).
 */
const findFirstDataRowCall = () => {
    const calls = addRowStub.getCalls();
    const headerIdx = calls.findIndex(
        call => Array.isArray(call.args[0]) && call.args[0].length > 0 && typeof call.args[0][0] === 'string',
    );
    if (headerIdx === -1 || headerIdx + 1 >= calls.length) {
        return undefined;
    }
    return calls[headerIdx + 1];
};

// ─── tests ────────────────────────────────────────────────────────────────────

describe('services/action/exportActions.creerClasseurExcel()', () => {
    const YEAR = 2024;

    beforeEach(() => {
        sandbox.reset();
        writtenCellValues.length = 0;
        writeBufferStub.resolves(Buffer.from([]));
    });

    afterEach(() => {
        sandbox.reset();
    });

    // ── Test 1 : structure des en-têtes ──────────────────────────────────────
    it('place "ID action" en index 3, "Opérateur principal" en index 4, et "Nom du projet" en index 5', async () => {
        const row = buildActionReportRow();
        await exportActions([row], YEAR);

        const call = findHeadersRowCall();
        expect(call, 'appel addRow des headers non trouvé').to.exist;

        const labels: string[] = call.args[0];
        expect(labels[3]).to.equal('ID action');
        expect(labels[4]).to.equal('Opérateur principal');
        expect(labels[5]).to.equal('Nom du projet');
    });

    // ── Test 2 : rowData[4] = operator_name ─────────────────────────────────
    it('place item.operator_name en index 4 de rowData', async () => {
        const row = buildActionReportRow({ operator_name: 'Mon Opérateur Principal' });
        await exportActions([row], YEAR);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        expect(rowData[4]).to.equal('Mon Opérateur Principal');
    });

    // ── Test 3 : rowData[4] vaut chaîne vide quand operator_name est null ───
    it('place une chaîne vide en index 4 de rowData quand operator_name est null', async () => {
        const row = buildActionReportRow({ operator_name: null });
        await exportActions([row], YEAR);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        expect(rowData[4]).to.equal('');
    });

    // ── Test 4 : rowData[5] = project_name (et non action_name) ─────────────
    it('place item.project_name en index 5 de rowData (et non action_name)', async () => {
        const row = buildActionReportRow({
            project_name: 'Mon Projet Renommé',
            action_name: 'Ancien nom action qui ne doit pas apparaître ici',
        });
        await exportActions([row], YEAR);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        expect(rowData[5]).to.equal('Mon Projet Renommé');
        expect(rowData[5]).not.to.equal('Ancien nom action qui ne doit pas apparaître ici');
    });

    // ── Test 5 : sectionTitles — la plage ACTION couvre désormais K6 ─────────
    // Avant l'évolution : { from: 'A6', to: 'J6' } (10 colonnes)
    // Après l'évolution : { from: 'A6', to: 'K6' } (11 colonnes, +1 pour "Opérateur principal")
    it('étend la plage de la section ACTION jusqu\'en colonne K (11 colonnes, de A6 à K6)', async () => {
        const row = buildActionReportRow();
        await exportActions([row], YEAR);

        // mergeCells(from, to) est appelé pour chaque section.
        // La section ACTION commence en A6 et doit maintenant finir en K6.
        const actionSectionCall = mergeCellsStub.getCalls().find(
            call => call.args[0] === 'A6',
        );
        expect(actionSectionCall, 'appel mergeCells pour la section ACTION non trouvé').to.exist;
        expect(actionSectionCall.args[1]).to.equal('K6');
    });

    // ── Test 6 : compteur DIHAL de l'en-tête (règle de fraîcheur partagée avec la liste) ─────────────
    // Le compteur n'utilise plus finance_dedie, metrics_updated_at ni les valeurs d'indicateurs : il s'appuie sur
    // has_dihal_financing, is_active_previous_year et indicators_up_to_date_90d calculés par le service.
    type FreshnessFields = {
        has_dihal_financing?: boolean | null,
        is_active_previous_year?: boolean,
        indicators_up_to_date_90d?: boolean,
        indicators_up_to_date_180d?: boolean,
    };
    const buildFreshRow = (override: Partial<ActionReportRowExtended> & FreshnessFields = {}): ActionReportRowExtended => buildActionReportRow(
        override as Partial<ActionReportRowExtended>,
    );
    const previousYear = new Date().getFullYear() - 1;
    const dihalHeaderTexts = () => writtenCellValues.filter(
        (value): value is string => typeof value === 'string' && value.includes('financées par la DIHAL'),
    );

    it('compte les actions DIHAL actives en N-1 et celles à jour depuis moins de 3 mois (sans finance_dedie ni metrics_updated_at)', async () => {
        const rows = [
            // à jour
            buildFreshRow({
                action_id: 1, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
            // active mais pas à jour
            buildFreshRow({
                action_id: 2, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: false,
            }),
            // non financée DIHAL : hors dénominateur même à jour
            buildFreshRow({
                action_id: 3, has_dihal_financing: false, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
            // inactive en N-1 : hors dénominateur
            buildFreshRow({
                action_id: 4, has_dihal_financing: true, is_active_previous_year: false, indicators_up_to_date_90d: false,
            }),
            // finance_dedie et metrics_updated_at ne comptent plus
            buildFreshRow({
                action_id: 5,
                finance_dedie: 5000,
                metrics_updated_at: new Date().toISOString(),
                nombre_personnes: 10,
                has_dihal_financing: false,
                is_active_previous_year: true,
                indicators_up_to_date_90d: false,
            }),
        ];

        await exportActions(rows, previousYear);

        const texts = dihalHeaderTexts();
        expect(texts.length).to.be.greaterThan(0);
        texts.forEach((text) => {
            expect(text).to.equal(
                `50% des actions actives en ${previousYear}, financées par la DIHAL ont des indicateurs mis à jour depuis moins de 3 mois (1 actions sur 2 actives en ${previousYear})`,
            );
        });
    });

    it('arrondit le pourcentage à une décimale', async () => {
        const rows = [
            buildFreshRow({
                action_id: 1, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
            buildFreshRow({
                action_id: 2, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: false,
            }),
            buildFreshRow({
                action_id: 3, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: false,
            }),
        ];

        await exportActions(rows, previousYear);

        expect(dihalHeaderTexts()[0]).to.equal(
            `33.3% des actions actives en ${previousYear}, financées par la DIHAL ont des indicateurs mis à jour depuis moins de 3 mois (1 actions sur 3 actives en ${previousYear})`,
        );
    });

    it('affiche 100% quand toutes les actions DIHAL actives sont à jour', async () => {
        const rows = [
            buildFreshRow({
                action_id: 1, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
        ];

        await exportActions(rows, previousYear);

        expect(dihalHeaderTexts()[0]).to.include(`100% des actions actives en ${previousYear}`);
        expect(dihalHeaderTexts()[0]).to.include('(1 actions sur 1 actives en');
    });

    it('n\'écrit pas la ligne quand le dénominateur est 0', async () => {
        const rows = [
            buildFreshRow({
                action_id: 1, has_dihal_financing: false, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
            buildFreshRow({
                action_id: 2, has_dihal_financing: true, is_active_previous_year: false, indicators_up_to_date_90d: false,
            }),
        ];

        await exportActions(rows, previousYear);

        expect(dihalHeaderTexts()).to.deep.equal([]);
    });

    it('n\'écrit pas la ligne sans information financière (has_dihal_financing non renseigné)', async () => {
        const rows = [
            buildFreshRow({ action_id: 1, is_active_previous_year: true, indicators_up_to_date_90d: true }),
            buildFreshRow({
                action_id: 2, has_dihal_financing: null, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
        ];

        await exportActions(rows, previousYear, false);

        expect(dihalHeaderTexts()).to.deep.equal([]);
    });

    it('conserve la condition d\'année : écrit la ligne pour N-1 et N, pas pour une autre année', async () => {
        const rows = [
            buildFreshRow({
                action_id: 1, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
        ];

        await exportActions(rows, new Date().getFullYear());
        expect(dihalHeaderTexts().length).to.be.greaterThan(0);

        writtenCellValues.length = 0;
        await exportActions(rows, previousYear - 1);
        expect(dihalHeaderTexts()).to.deep.equal([]);
    });

    it('calcule le compteur par onglet : seules les lignes du département comptent dans son en-tête', async () => {
        const rows = [
            buildFreshRow({
                action_id: 1, departement_code: '78', has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: true,
            } as Partial<ActionReportRowExtended>),
            buildFreshRow({
                action_id: 2, departement_code: '75', has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: false,
            } as Partial<ActionReportRowExtended>),
        ];

        await exportActions(rows, previousYear);

        const texts = dihalHeaderTexts();
        expect(texts.some(text => text.includes('(1 actions sur 2 actives'))).to.equal(true); // onglet « Tous »
        expect(texts.some(text => text.includes('100%') && text.includes('(1 actions sur 1 actives'))).to.equal(true); // 78
        expect(texts.some(text => text.includes('0%') && !text.includes('100%') && text.includes('(0 actions sur 1 actives'))).to.equal(true); // 75
    });

    // ── En-tête : date de référence unique (`now` transmis par le service) ─────────────────────────
    // setDepartementHeader calcule N-1 et la campagne {N-1, N} à partir du `now` reçu (6e paramètre de
    // l'export), jamais de l'horloge. L'horloge réelle des tests (fin 2026) ne doit donc avoir aucune influence.
    describe('date de référence transmise (now)', () => {
        const dihalRows = () => [
            buildFreshRow({
                action_id: 1, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: true,
            }),
            buildFreshRow({
                action_id: 2, has_dihal_financing: true, is_active_previous_year: true, indicators_up_to_date_90d: false,
            }),
        ];
        const exportAt = (now: Date, year: number) => exportActions(dihalRows(), year, true, null, null, now);
        const dateHeaderTexts = () => writtenCellValues.filter(
            (value): value is string => typeof value === 'string' && value.startsWith('à la date du'),
        );

        const LAST_MOMENT_OF_2026 = new Date(2026, 11, 31, 23, 59, 0, 0);
        const FIRST_MOMENT_OF_2027 = new Date(2027, 0, 1, 0, 0, 0, 0);

        it('le 31/12/2026 23:59 : N-1 vaut 2025 dans le libellé et la date affichée est celle de now', async () => {
            await exportAt(LAST_MOMENT_OF_2026, 2025);

            const texts = dihalHeaderTexts();
            expect(texts.length).to.be.greaterThan(0);
            texts.forEach((text) => {
                expect(text).to.include('des actions actives en 2025,');
                expect(text).to.include('actives en 2025)');
            });
            expect(dateHeaderTexts().length).to.be.greaterThan(0);
            dateHeaderTexts().forEach(text => expect(text).to.equal('à la date du 31/12/2026'));
        });

        it('le 31/12/2026 23:59 : la campagne est {2025, 2026} (ligne affichée pour 2026, absente pour 2027)', async () => {
            await exportAt(LAST_MOMENT_OF_2026, 2026);
            expect(dihalHeaderTexts().length).to.be.greaterThan(0);
            expect(dihalHeaderTexts()[0]).to.include('actives en 2025,');

            writtenCellValues.length = 0;
            await exportAt(LAST_MOMENT_OF_2026, 2027);
            expect(dihalHeaderTexts()).to.deep.equal([]);
        });

        it('le 01/01/2027 00:00 : N-1 vaut 2026 dans le libellé et la date affichée est celle de now', async () => {
            await exportAt(FIRST_MOMENT_OF_2027, 2026);

            const texts = dihalHeaderTexts();
            expect(texts.length).to.be.greaterThan(0);
            texts.forEach((text) => {
                expect(text).to.include('des actions actives en 2026,');
                expect(text).to.include('actives en 2026)');
                expect(text).to.not.include('actives en 2025');
            });
            dateHeaderTexts().forEach(text => expect(text).to.equal('à la date du 01/01/2027'));
        });

        it('le 01/01/2027 00:00 : la campagne est {2026, 2027} (ligne affichée pour 2027, absente pour 2025)', async () => {
            await exportAt(FIRST_MOMENT_OF_2027, 2027);
            expect(dihalHeaderTexts().length).to.be.greaterThan(0);
            expect(dihalHeaderTexts()[0]).to.include('actives en 2026,');

            writtenCellValues.length = 0;
            await exportAt(FIRST_MOMENT_OF_2027, 2025);
            expect(dihalHeaderTexts()).to.deep.equal([]);
        });

        it('ne dépend pas de l\'horloge : un now lointain (2040) décide seul du libellé et de la campagne', async () => {
            await exportAt(new Date(2040, 5, 15, 12, 0, 0, 0), 2039);

            expect(dihalHeaderTexts().length).to.be.greaterThan(0);
            expect(dihalHeaderTexts()[0]).to.include('actives en 2039,');
            dateHeaderTexts().forEach(text => expect(text).to.equal('à la date du 15/06/2040'));
        });
    });

    // ── Test 7 : Valeurs nulles affichées avec un tiret ─────────────────────
    it('affiche un tiret "-" pour les valeurs numériques nulles au lieu de 0 ou vide', async () => {
        const actionWithNullMetrics = buildActionReportRow({
            nombre_personnes: null,
            nombre_menages: null,
            finance_dedie: null,
        });

        await exportActions([actionWithNullMetrics], YEAR);

        const dataRowCall = addRowStub.getCalls().find((call) => {
            const firstArg = call.args[0];
            return Array.isArray(firstArg) && firstArg.includes('Projet intégration');
        });

        expect(dataRowCall, 'appel addRow pour la ligne de données non trouvé').to.exist;

        const rowData = dataRowCall.args[0];
        const nombrePersonnesIndex = 11;
        const nombreMenagesIndex = 12;

        expect(rowData[nombrePersonnesIndex]).to.equal('-');
        expect(rowData[nombreMenagesIndex]).to.equal('-');
    });

    // ── Test 8 : Totaux calculés affichent "-" quand toutes les valeurs sont null ───
    it('affiche un tiret "-" pour les totaux calculés quand toutes les valeurs sources sont null', async () => {
        const actionWithNullScolarMetrics = buildActionReportRow({
            scolaire_mineurs_moins_de_trois_ans: null,
            scolaire_mineurs_trois_ans_et_plus: null,
            scolaire_nombre_maternelle: null,
            scolaire_nombre_elementaire: null,
            scolaire_nombre_college: null,
            scolaire_nombre_lycee: null,
        });

        await exportActions([actionWithNullScolarMetrics], YEAR);

        const dataRowCall = addRowStub.getCalls().find((call) => {
            const firstArg = call.args[0];
            return Array.isArray(firstArg) && firstArg.includes('Projet intégration');
        });

        expect(dataRowCall, 'appel addRow pour la ligne de données non trouvé').to.exist;

        const rowData = dataRowCall.args[0];
        const mineursIdentifiesTotalIndex = 22;
        const mineursScolarisesTotalIndex = 29;

        expect(rowData[mineursIdentifiesTotalIndex]).to.equal('-');
        expect(rowData[mineursScolarisesTotalIndex]).to.equal('-');
    });

    // ── Test 9 : Totaux calculés affichent 0 quand au moins une valeur est 0 ───
    it('affiche 0 pour les totaux calculés quand au moins une valeur source est 0', async () => {
        const actionWithZeroScolarMetrics = buildActionReportRow({
            scolaire_mineurs_moins_de_trois_ans: 0,
            scolaire_mineurs_trois_ans_et_plus: null,
            scolaire_nombre_maternelle: 0,
            scolaire_nombre_elementaire: null,
            scolaire_nombre_college: null,
            scolaire_nombre_lycee: null,
        });

        await exportActions([actionWithZeroScolarMetrics], YEAR);

        const dataRowCall = addRowStub.getCalls().find((call) => {
            const firstArg = call.args[0];
            return Array.isArray(firstArg) && firstArg.includes('Projet intégration');
        });

        expect(dataRowCall, 'appel addRow pour la ligne de données non trouvé').to.exist;

        const rowData = dataRowCall.args[0];
        const mineursIdentifiesTotalIndex = 22;
        const mineursScolarisesTotalIndex = 29;

        expect(rowData[mineursIdentifiesTotalIndex]).to.equal(0);
        expect(rowData[mineursScolarisesTotalIndex]).to.equal(0);
    });

    // ── Test 10 : Section FINANCEMENT étendue jusqu'à AV6 ─────────────────────
    it('étend la plage de la section FINANCEMENT jusqu\'en colonne AV (de AJ6 à AV6)', async () => {
        const row = buildActionReportRow();
        await exportActions([row], YEAR);

        const financementSectionCall = mergeCellsStub.getCalls().find(
            call => call.args[0] === 'AJ6',
        );
        expect(financementSectionCall, 'appel mergeCells pour la section FINANCEMENT non trouvé').to.exist;
        expect(financementSectionCall.args[1]).to.equal('AV6');
    });

    // ── Test 11 : Section COMMENTAIRES déplacée vers AW6-AY6 ─────────────────
    it('place la section COMMENTAIRES de AW6 à AY6 (après l\'ajout de la colonne DIHAL)', async () => {
        const row = buildActionReportRow();
        await exportActions([row], YEAR);

        const commentairesSectionCall = mergeCellsStub.getCalls().find(
            call => call.args[0] === 'AW6',
        );
        expect(commentairesSectionCall, 'appel mergeCells pour la section COMMENTAIRES non trouvé').to.exist;
        expect(commentairesSectionCall.args[1]).to.equal('AY6');
    });

    // ── Test 12 : Section MISE À JOUR déplacée vers AZ6-BA6 ──────────────────
    it('place la section MISE À JOUR de AZ6 à BA6 (après l\'ajout de la colonne DIHAL)', async () => {
        const row = buildActionReportRow();
        await exportActions([row], YEAR);

        const miseAJourSectionCall = mergeCellsStub.getCalls().find(
            call => call.args[0] === 'AZ6',
        );
        expect(miseAJourSectionCall, 'appel mergeCells pour la section MISE À JOUR non trouvé').to.exist;
        expect(miseAJourSectionCall.args[1]).to.equal('BA6');
    });

    // ── Test 13 : Header "Financée par la DIHAL" présent à l'index 37 ────────
    it('place le header "Financée par la DIHAL" à l\'index 37 (entre dépenses étatiques et crédits dédiés)', async () => {
        const row = buildActionReportRow();
        await exportActions([row], YEAR);

        const call = findHeadersRowCall();
        expect(call, 'appel addRow des headers non trouvé').to.exist;

        const labels: string[] = call.args[0];
        expect(labels[37]).to.equal('Financée par la DIHAL');
        expect(labels[36]).to.equal('Dépense sur financement étatique hors crédits dédiés');
        expect(labels[38]).to.equal('Crédits dédiés à la résorption des bidonvilles');
    });

    // ── Test 14 : Colonne financee_dihal affiche "Oui" quand true ────────────
    it('affiche "Oui" dans la colonne financee_dihal quand la valeur est true', async () => {
        const row = buildActionReportRow({ financee_dihal: true });
        await exportActions([row], YEAR);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        // Index 37 dans rowData (35 colonnes avant financement + finance_etatique + depense_finance_etatique)
        const financeDihalIndex = 37;
        expect(rowData[financeDihalIndex]).to.equal('Oui');
    });

    // ── Test 15 : Colonne financee_dihal affiche "Non" quand false ───────────
    it('affiche "Non" dans la colonne financee_dihal quand la valeur est false', async () => {
        const row = buildActionReportRow({ financee_dihal: false });
        await exportActions([row], YEAR);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        const financeDihalIndex = 37;
        expect(rowData[financeDihalIndex]).to.equal('Non');
    });

    // ── Test 16 : Colonne financee_dihal affiche "Non" quand null ────────────
    it('affiche "Non" dans la colonne financee_dihal quand la valeur est null', async () => {
        const row = buildActionReportRow({ financee_dihal: null });
        await exportActions([row], YEAR);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        const financeDihalIndex = 37;
        expect(rowData[financeDihalIndex]).to.equal('Non');
    });

    // ── Test 17 : Colonne financee_dihal absente quand includeFinances = false ───
    it('n\'inclut pas la colonne financee_dihal quand includeFinances est false', async () => {
        const row = buildActionReportRow({ financee_dihal: true });
        await exportActions([row], YEAR, false); // includeFinances = false

        const headerCall = findHeadersRowCall();
        expect(headerCall, 'appel addRow des headers non trouvé').to.exist;

        const labels: string[] = headerCall.args[0];
        expect(labels).to.not.include('Financée par la DIHAL');
        expect(labels).to.not.include('Crédits dédiés à la résorption des bidonvilles');
        expect(labels).to.not.include('Financement étatique hors crédits dédiés');

        const dataCall = findFirstDataRowCall();
        expect(dataCall, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = dataCall.args[0];
        // Sans bloc financement, rowData contient 35 colonnes avant financement + 5 colonnes après (commentaires+mises à jour)
        // donc 40 colonnes au total, pas 53 (qui serait avec les 13 colonnes de financement)
        expect(rowData).to.have.lengthOf(40);
    });

    // ── Test 18 : accès financement restreint à une liste d'actions ──────────
    it('affiche "Oui"/"Non" pour financee_dihal quand l\'action fait partie des actions autorisées', async () => {
        const row = buildActionReportRow({ action_id: 251, financee_dihal: true });
        await exportActions([row], YEAR, true, null, [251, 410]);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        const financeDihalIndex = 37;
        expect(rowData[financeDihalIndex]).to.equal('Oui');
    });

    it('affiche "-" pour financee_dihal quand l\'action ne fait pas partie des actions autorisées', async () => {
        const row = buildActionReportRow({ action_id: 999, financee_dihal: true });
        await exportActions([row], YEAR, true, null, [251, 410]);

        const call = findFirstDataRowCall();
        expect(call, 'appel addRow des données non trouvé').to.exist;

        const rowData: any[] = call.args[0];
        const financeDihalIndex = 37;
        expect(rowData[financeDihalIndex]).to.equal('-');
    });
});
