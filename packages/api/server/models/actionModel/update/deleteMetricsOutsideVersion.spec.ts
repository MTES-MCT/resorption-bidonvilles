import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `update/deleteMetricsOutsideVersion.ts`
 *
 *   export default function deleteMetricsOutsideVersion(actionId: number, versionId: number, transaction: Transaction): Promise<unknown>
 *
 * DELETE FROM action_metrics WHERE fk_action = :actionId AND fk_version IS DISTINCT FROM :versionId
 * (supprime anciennes versions, lignes sans version, années remplacées ou retirées).
 * replacements { actionId, versionId }.
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
import deleteMetricsOutsideVersion from './deleteMetricsOutsideVersion';
rewiremock.disable();

describe('models/actionModel/update/deleteMetricsOutsideVersion()', () => {
    const actionId = 7;
    const versionId = 42;
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

    it('supprime les lignes de l\'action dont fk_version est distinct de la version donnée', async () => {
        await deleteMetricsOutsideVersion(actionId, versionId, transaction);

        expect(stubs.sequelize.query).to.have.been.calledOnce;
        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.match(/DELETE FROM action_metrics\b/);
        expect(sql).to.match(/fk_action = :actionId/);
        expect(sql).to.match(/fk_version IS DISTINCT FROM :versionId/);
    });

    it('n\'utilise pas de comparaison <> ou != qui ignorerait les lignes sans version (NULL)', async () => {
        await deleteMetricsOutsideVersion(actionId, versionId, transaction);

        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(sql).not.to.match(/fk_version\s*(<>|!=)/);
    });

    it('transmet les replacements, le type DELETE et la transaction', async () => {
        await deleteMetricsOutsideVersion(actionId, versionId, transaction);

        const [, options] = stubs.sequelize.query.firstCall.args;
        expect(options.replacements).to.eql({ actionId, versionId });
        expect(options.type).to.equal('DELETE');
        expect(options.transaction).to.equal(transaction);
    });

    it('propage l\'erreur de la requête', async () => {
        stubs.sequelize.query.rejects(new Error('boom'));

        try {
            await deleteMetricsOutsideVersion(actionId, versionId, transaction);
            expect.fail('aurait dû lever une erreur');
        } catch (error) {
            expect((error as Error).message).to.equal('boom');
        }
    });
});
