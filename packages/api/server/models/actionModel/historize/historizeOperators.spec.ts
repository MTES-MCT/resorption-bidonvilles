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
// La config rewiremock du projet est en mode strict (noAutoPassBy). On fournit
// un stub minimal du package sequelize : seul QueryTypes.INSERT est utilisé au
// runtime ; Transaction n'est qu'un type TypeScript (effacé à la compilation).
rewiremock('sequelize').with({ QueryTypes: { INSERT: 'INSERT' } });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import historizeOperators from './historizeOperators';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/actionModel/historize/historizeOperators()', () => {
    const ACTION_ID = 42;
    const HISTORY_ID = 99;
    const fakeTransaction = { id: 'tx-fake' } as any;

    beforeEach(() => {
        queryStub.resolves([[], 0]);
    });

    afterEach(() => {
        sandbox.reset();
    });

    // ── Test 1 : is_principal présent dans la requête SQL ─────────────────────
    it('appelle sequelize.query avec une requête SQL qui contient is_principal dans les colonnes INSERT', async () => {
        await historizeOperators(ACTION_ID, HISTORY_ID, fakeTransaction);

        expect(queryStub).to.have.been.calledOnce;

        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('is_principal');
    });

    it('inclut is_principal à la fois dans la liste des colonnes cibles et dans le SELECT', async () => {
        await historizeOperators(ACTION_ID, HISTORY_ID, fakeTransaction);

        const sql: string = queryStub.firstCall.args[0];

        // La requête a la forme :
        //   INSERT INTO action_operators_history( <colonnes cibles> ) (SELECT <colonnes source> FROM action_operators WHERE ...)
        // On isole les deux zones sans regex (évite l'alerte ReDoS de SonarQube).
        const openParenIndex = sql.indexOf('(');
        const closeParenIndex = sql.indexOf(')');
        const fromIndex = sql.indexOf(' FROM ');
        expect(openParenIndex, 'parenthèse ouvrante INSERT introuvable').to.be.greaterThan(-1);
        expect(closeParenIndex, 'parenthèse fermante INSERT introuvable').to.be.greaterThan(openParenIndex);
        expect(fromIndex, 'mot-clé FROM introuvable').to.be.greaterThan(closeParenIndex);

        // Zone INSERT : entre la première parenthèse ouvrante et sa fermante.
        const insertBlock = sql.slice(openParenIndex + 1, closeParenIndex);
        expect(insertBlock).to.include('is_principal');

        // Zone SELECT : entre la première parenthèse fermante (fin du bloc INSERT)
        // et le premier ' FROM ' (les colonnes source en SELECT sont entre les deux).
        const selectBlock = sql.slice(closeParenIndex + 1, fromIndex);
        expect(selectBlock).to.include('is_principal');
    });

    // ── Test 2 : la transaction est bien transmise ────────────────────────────
    it('transmet la transaction à sequelize.query', async () => {
        await historizeOperators(ACTION_ID, HISTORY_ID, fakeTransaction);

        const options = queryStub.firstCall.args[1];
        expect(options).to.have.property('transaction', fakeTransaction);
    });

    // ── Test 3 : les replacements :id et :hid sont corrects ──────────────────
    it('passe :id (action) et :hid (history) dans les replacements', async () => {
        await historizeOperators(ACTION_ID, HISTORY_ID, fakeTransaction);

        const options = queryStub.firstCall.args[1];
        expect(options).to.have.nested.property('replacements.id', ACTION_ID);
        expect(options).to.have.nested.property('replacements.hid', HISTORY_ID);
    });
});
