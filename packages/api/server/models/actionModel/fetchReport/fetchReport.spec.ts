import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

// ─── stubs ────────────────────────────────────────────────────────────────────

const sandbox = sinon.createSandbox();
const queryStub = sandbox.stub();

const fakeSequelize = {
    query: queryStub,
};

rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });
rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
// enrichWhere ne fait pas d'I/O : on le laisse passer tel quel
rewiremock('../fetch/enrichWhere').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetchReport from './fetchReport';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/actionModel/fetchReport/fetchReport()', () => {
    const YEAR = 2024;

    beforeEach(() => {
        queryStub.resolves([]);
    });

    afterEach(() => {
        sandbox.reset();
    });

    // ── Test 1 : operator_name présent dans la requête SQL ───────────────────
    it('génère une requête SQL qui expose operator_name (opérateur principal)', async () => {
        await fetchReport(YEAR);

        expect(queryStub).to.have.been.calledOnce;

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('operator_name');
    });

    // ── Test 2 : project_name présent dans la requête SQL ───────────────────
    it('génère une requête SQL qui expose project_name (nom du projet)', async () => {
        await fetchReport(YEAR);

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('project_name');
    });

    // ── Test 3 : action_name toujours présent (rétrocompatibilité) ───────────
    it('génère une requête SQL qui expose toujours action_name (rétrocompatibilité)', async () => {
        await fetchReport(YEAR);

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('action_name');
    });

    // ── Test 4 : NULLIF utilisé pour les financements ────────────────────────
    it('utilise NULLIF pour retourner NULL au lieu de 0 pour les financements sans valeur', async () => {
        await fetchReport(YEAR);

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('NULLIF(SUM(CASE WHEN af.fk_action_finance_type');
        expect(sql).to.include('finance_etatique');
        expect(sql).to.include('finance_dedie');
        expect(sql).to.include('depense_finance_etatique');
    });
});
