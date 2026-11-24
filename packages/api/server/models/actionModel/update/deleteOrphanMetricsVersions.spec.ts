import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `update/deleteOrphanMetricsVersions.ts`
 *
 *   export default function deleteOrphanMetricsVersions(actionId: number, transaction: Transaction): Promise<unknown>
 *
 * DELETE FROM action_metrics_versions WHERE fk_action = :actionId AND NOT EXISTS/NOT IN (lignes d'action_metrics rattachées).
 * replacements { actionId }.
 */
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        query: sandbox.stub(),
    },
};

rewiremock('sequelize').with({ QueryTypes: { DELETE: 'DELETE' } });
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteOrphanMetricsVersions from './deleteOrphanMetricsVersions';
rewiremock.disable();

describe('models/actionModel/update/deleteOrphanMetricsVersions()', () => {
    const actionId = 7;
    const transaction = {} as any;

    beforeEach(() => {
        stubs.sequelize.query.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    it('supprime les versions de l\'action qui n\'ont plus aucune ligne d\'indicateurs', async () => {
        await deleteOrphanMetricsVersions(actionId, transaction);

        expect(stubs.sequelize.query).to.have.been.calledOnce;
        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.match(/DELETE FROM action_metrics_versions\b/);
        expect(sql).to.match(/fk_action = :actionId/);
        expect(sql).to.match(/NOT (EXISTS|IN)/);
        expect(sql).to.match(/FROM action_metrics\b(?!_versions)/);
        expect(sql).to.match(/fk_version/);
    });

    it('transmet les replacements, le type DELETE et la transaction', async () => {
        await deleteOrphanMetricsVersions(actionId, transaction);

        const [, options] = stubs.sequelize.query.firstCall.args;
        expect(options.replacements).to.eql({ actionId });
        expect(options.type).to.equal('DELETE');
        expect(options.transaction).to.equal(transaction);
    });

    it('propage l\'erreur de la requête', async () => {
        stubs.sequelize.query.rejects(new Error('boom'));

        try {
            await deleteOrphanMetricsVersions(actionId, transaction);
            expect.fail('aurait dû lever une erreur');
        } catch (error) {
            expect((error as Error).message).to.equal('boom');
        }
    });
});
