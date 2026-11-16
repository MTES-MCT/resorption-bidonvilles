import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `update/createMetricsVersion.ts`
 *
 *   export default function createMetricsVersion(actionId: number, authorId: number, transaction: Transaction): Promise<number>
 *
 * INSERT INTO action_metrics_versions(fk_action, version_at, version_by) ... RETURNING action_metrics_version_id
 * avec replacements { actionId, authorId } ; version_at = CURRENT_TIMESTAMP côté SQL (jamais une date JS).
 */
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        query: sandbox.stub(),
    },
};

rewiremock('sequelize').with({ QueryTypes: { INSERT: 'INSERT' } });
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createMetricsVersion from './createMetricsVersion';
rewiremock.disable();

describe('models/actionModel/update/createMetricsVersion()', () => {
    const actionId = 7;
    const authorId = 12;
    const transaction = {} as any;

    beforeEach(() => {
        stubs.sequelize.query.resolves([[{ action_metrics_version_id: 42 }], 1]);
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    it('insère une version dans action_metrics_versions et retourne son identifiant', async () => {
        const result = await createMetricsVersion(actionId, authorId, transaction);

        expect(stubs.sequelize.query).to.have.been.calledOnce;
        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.match(/INSERT INTO action_metrics_versions/);
        expect(sql).to.match(/fk_action/);
        expect(sql).to.match(/version_at/);
        expect(sql).to.match(/version_by/);
        expect(sql).to.match(/RETURNING action_metrics_version_id/);
        expect(result).to.equal(42);
    });

    it('utilise CURRENT_TIMESTAMP côté SQL pour version_at', async () => {
        await createMetricsVersion(actionId, authorId, transaction);

        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.match(/CURRENT_TIMESTAMP/);
    });

    it('ne transmet aucune date JavaScript : seuls l\'action et l\'auteur sont des paramètres', async () => {
        await createMetricsVersion(actionId, authorId, transaction);

        const [sql, options] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.match(/:actionId/);
        expect(sql).to.match(/:authorId/);
        expect(options.replacements).to.eql({ actionId, authorId });
        Object.values(options.replacements).forEach(value => expect(value).not.to.be.instanceOf(Date));
    });

    it('exécute la requête de type INSERT dans la transaction fournie', async () => {
        await createMetricsVersion(actionId, authorId, transaction);

        const [, options] = stubs.sequelize.query.firstCall.args;
        expect(options.type).to.equal('INSERT');
        expect(options.transaction).to.equal(transaction);
    });

    it('propage l\'erreur de la requête', async () => {
        stubs.sequelize.query.rejects(new Error('boom'));

        try {
            await createMetricsVersion(actionId, authorId, transaction);
            expect.fail('aurait dû lever une erreur');
        } catch (error) {
            expect((error as Error).message).to.equal('boom');
        }
    });
});
