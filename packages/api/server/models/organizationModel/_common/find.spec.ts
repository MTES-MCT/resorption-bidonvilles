import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

// ─── jeu de données brut ────────────────────────────────────────────────────
// Ce jeu de données représente ce que retournerait la base après application du
// LEFT JOIN organizations -> users (une ligne par utilisateur, ou une seule ligne
// avec des champs "user_*" à null quand l'organization n'a aucun utilisateur).
// Le champ `organizationActive` n'existe pas dans le vrai OrganizationRow : il ne
// sert qu'à notre simulateur de clause WHERE ci-dessous, pour imiter le comportement
// réel de Postgres sans avoir à exécuter de vraie requête SQL.

type FakeRow = {
    organization_id: number,
    name: string,
    abbreviation: string | null,
    being_funded: boolean,
    being_funded_at: Date,
    user_id: number | null,
    user_role_admin: string | null,
    user_firstName: string | null,
    user_lastName: string | null,
    user_email: string | null,
    user_phone: string | null,
    user_position: string | null,
    user_topics: string[],
    user_role_regular: string | null,
    user_status: string | null,
    user_to_be_tracked: boolean | null,
    type_id: number,
    type_category: string,
    type_name: string,
    type_abbreviation: string | null,
    organizationActive: boolean,
};

const makeRow = (overrides: Partial<FakeRow>): FakeRow => ({
    organization_id: 0,
    name: '',
    abbreviation: null,
    being_funded: false,
    being_funded_at: null,
    user_id: null,
    user_role_admin: null,
    user_firstName: null,
    user_lastName: null,
    user_email: null,
    user_phone: null,
    user_position: null,
    user_topics: [],
    user_role_regular: null,
    user_status: null,
    user_to_be_tracked: null,
    type_id: 1,
    type_category: 'category',
    type_name: 'Type',
    type_abbreviation: null,
    organizationActive: true,
    ...overrides,
});

// Org A (active) : un utilisateur actif suivi + un utilisateur inactif
const ORG_A_USER_ACTIVE = makeRow({
    organization_id: 1,
    name: 'Org A',
    user_id: 101,
    user_firstName: 'Alice',
    user_lastName: 'Active',
    user_status: 'active',
    user_to_be_tracked: true,
    organizationActive: true,
});
const ORG_A_USER_INACTIVE = makeRow({
    organization_id: 1,
    name: 'Org A',
    user_id: 102,
    user_firstName: 'Bob',
    user_lastName: 'Inactive',
    user_status: 'inactive',
    user_to_be_tracked: true,
    organizationActive: true,
});

// Org B (active) : aucun utilisateur du tout (ligne LEFT JOIN avec user_id = null)
const ORG_B_NO_USER = makeRow({
    organization_id: 2,
    name: 'Org B',
    user_id: null,
    organizationActive: true,
});

// Org C (inactive) : un utilisateur actif
const ORG_C_USER_ACTIVE = makeRow({
    organization_id: 3,
    name: 'Org C',
    user_id: 301,
    user_firstName: 'Carl',
    user_lastName: 'Active',
    user_status: 'active',
    user_to_be_tracked: true,
    organizationActive: false,
});

// Org D (active) : uniquement des utilisateurs inactifs
const ORG_D_USER_INACTIVE = makeRow({
    organization_id: 4,
    name: 'Org D',
    user_id: 401,
    user_firstName: 'Dan',
    user_lastName: 'Inactive',
    user_status: 'inactive',
    user_to_be_tracked: true,
    organizationActive: true,
});

const ALL_ROWS: FakeRow[] = [
    ORG_A_USER_ACTIVE,
    ORG_A_USER_INACTIVE,
    ORG_B_NO_USER,
    ORG_C_USER_ACTIVE,
    ORG_D_USER_INACTIVE,
];

// ─── simulateur minimal de la clause WHERE générée par find() ──────────────
// On n'exécute pas de vraie requête SQL : on inspecte la chaîne SQL produite par
// find() pour reproduire fidèlement le comportement réel de Postgres.
//   - si la clause WHERE référence `users.fk_status` (condition posée sur une colonne
//     issue du LEFT JOIN), Postgres se comporte comme un INNER JOIN : les organizations
//     sans utilisateur actif disparaissent (c'est le bug).
//   - si la clause WHERE ne référence que `organizations.active`, le LEFT JOIN est
//     préservé : les organizations actives sans utilisateur actif restent présentes,
//     avec des colonnes `user_*` à null.
const extractWhereClause = (sql: string): string => {
    const match = sql.match(/WHERE([\s\S]*?)ORDER BY/);
    return match ? match[1] : '';
};

const simulateQuery = (sql: string, replacements: { ids?: number[] }): FakeRow[] => {
    const whereClause = extractWhereClause(sql);
    let rows = ALL_ROWS;

    if (/organization_id IN \(:ids\)/.test(whereClause) && replacements.ids !== undefined) {
        rows = rows.filter(row => replacements.ids.includes(row.organization_id));
    }

    if (/users\.fk_status/.test(whereClause)) {
        // comportement bugué : la condition sur une colonne du LEFT JOIN annule celui-ci
        rows = rows.filter(row => row.organizationActive === true
            && row.user_status === 'active'
            && row.user_to_be_tracked === true);
    } else if (/organizations\.active = TRUE/.test(whereClause)) {
        // comportement cible : seul organizations.active filtre, le LEFT JOIN est préservé
        rows = rows.filter(row => row.organizationActive === true);
    }

    return rows;
};

// ─── stubs ───────────────────────────────────────────────────────────────────

const sandbox = sinon.createSandbox();
const queryStub = sandbox.stub();
const listInterventionAreasStub = sandbox.stub();
const hashAreasStub = sandbox.stub();

const fakeSequelize = {
    query: queryStub,
};

rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });
rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
rewiremock('#server/models/interventionAreaModel/hash').withDefault(hashAreasStub);
rewiremock('#server/models/interventionAreaModel/list').withDefault(listInterventionAreasStub);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import find from './find';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/organizationModel/_common/find()', () => {
    beforeEach(() => {
        queryStub.callsFake(async (sql: string, options: { replacements: { ids?: number[] } }) => simulateQuery(sql, options.replacements));
        listInterventionAreasStub.resolves([]);
        hashAreasStub.returns(undefined);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it(
        ' retourne les organizations actives sans aucun utilisateur actif (voire sans aucun utilisateur) quand activeOrganizationsOnly=true',
        async () => {
            const result = await find({ activeOrganizationsOnly: true } as any);

            const ids = result.map(organization => organization.id);
            expect(ids).to.include(2); // Org B : active, sans aucun utilisateur
            expect(ids).to.include(4); // Org D : active, uniquement des utilisateurs inactifs

            const orgB = result.find(organization => organization.id === 2);
            expect(orgB.users).to.deep.equal([]);
        },
    );

    it(' exclut les organizations inactives quand activeOrganizationsOnly=true', async () => {
        const result = await find({ activeOrganizationsOnly: true } as any);

        const ids = result.map(organization => organization.id);
        expect(ids).to.not.include(3); // Org C : inactive
    });

    it(
        ' avec activeOrganizationsOnly=true et activeOnly=true (cas réel de getDirectory), retourne '
        + 'une organization active sans utilisateur actif avec un tableau users vide, et une organization '
        + 'mixte avec uniquement ses utilisateurs actifs',
        async () => {
            const result = await find({ activeOrganizationsOnly: true, activeOnly: true } as any);

            const ids = result.map(organization => organization.id);
            expect(ids).to.not.include(3); // Org C : inactive, toujours exclue

            const orgA = result.find(organization => organization.id === 1);
            expect(orgA).to.not.be.undefined;
            expect(orgA.users).to.have.lengthOf(1);
            expect(orgA.users[0].id).to.equal(101);

            const orgB = result.find(organization => organization.id === 2);
            expect(orgB).to.not.be.undefined;
            expect(orgB.users).to.deep.equal([]);

            const orgD = result.find(organization => organization.id === 4);
            expect(orgD).to.not.be.undefined;
            expect(orgD.users).to.deep.equal([]);
        },
    );

    it(' n\'ajoute pas de condition sur users.fk_status/users.to_be_tracked dans la clause WHERE (le LEFT JOIN ne doit pas être annulé)', async () => {
        await find({ activeOrganizationsOnly: true } as any);

        const sql: string = queryStub.firstCall.args[0];
        const whereClause = extractWhereClause(sql);
        expect(whereClause).to.not.match(/users\.fk_status/);
        expect(whereClause).to.not.match(/users\.to_be_tracked/);
    });

    it(' (non-régression) filtre par options.ids', async () => {
        const result = await find({ ids: [1, 3] });

        const ids = result.map(organization => organization.id).sort();
        expect(ids).to.deep.equal([1, 3]);
    });

    it(' (non-régression) sans option, retourne toutes les organizations avec tous leurs utilisateurs quel que soit leur statut', async () => {
        const result = await find();

        const ids = result.map(organization => organization.id).sort();
        expect(ids).to.deep.equal([1, 2, 3, 4]);

        const orgA = result.find(organization => organization.id === 1);
        expect(orgA.users).to.have.lengthOf(2);
    });
});
