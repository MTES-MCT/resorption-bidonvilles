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
        scolaire_mineurs_scolarisables: null,
        scolaire_mineurs_en_mediation: null,
        scolaire_nombre_maternelle: null,
        scolaire_nombre_elementaire: null,
        scolaire_nombre_college: null,
        scolaire_nombre_lycee: null,
        scolaire_nombre_autre: null,
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

// Cellule factice réutilisable
const fakeCell = {
    value: null,
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
});
