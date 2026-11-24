import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `update/moveMetricsToVersion.ts`
 *
 *   export default function moveMetricsToVersion(actionId: number, versionId: number, years: number[], transaction: Transaction): Promise<unknown>
 *
 * UPDATE action_metrics SET fk_version = :versionId pour les lignes de RANG 1 de l'action (rang calculé en SQL sur la clé de
 * version partagée `_common/metricsVersionKey`) dont l'année de `date` est dans :years.
 * replacements { actionId, versionId, years } : AUCUN timestamp (pg = microsecondes, JS = millisecondes).
 * Aucune requête si `years` est vide.
 */
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        query: sandbox.stub(),
    },
    metricsVersionKey: sandbox.stub(),
};

rewiremock('sequelize').with({ QueryTypes: { UPDATE: 'UPDATE' } });
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('../_common/metricsVersionKey').with(stubs.metricsVersionKey);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import moveMetricsToVersion from './moveMetricsToVersion';
rewiremock.disable();

const KEY_MARKER = '__CLE_DE_VERSION__';

describe('models/actionModel/update/moveMetricsToVersion()', () => {
    const actionId = 7;
    const versionId = 42;
    const transaction = {} as any;

    beforeEach(() => {
        stubs.sequelize.query.resolves();
        stubs.metricsVersionKey.returns(KEY_MARKER);
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    it('n\'exécute aucune requête quand la liste d\'années est vide', async () => {
        await moveMetricsToVersion(actionId, versionId, [], transaction);

        expect(stubs.sequelize.query).not.to.have.been.called;
    });

    it('met à jour fk_version des lignes de l\'action', async () => {
        await moveMetricsToVersion(actionId, versionId, [2022, 2024], transaction);

        expect(stubs.sequelize.query).to.have.been.calledOnce;
        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.match(/UPDATE action_metrics\b/);
        expect(sql).to.match(/SET\s+fk_version = :versionId/);
        expect(sql).to.match(/fk_action = :actionId/);
    });

    it('identifie les lignes à déplacer en SQL par leur rang (RANK ... = 1) et par leur année', async () => {
        await moveMetricsToVersion(actionId, versionId, [2022, 2024], transaction);

        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.match(/RANK\(\)\s+OVER\s*\(/);
        expect(sql).to.match(/PARTITION BY [\w.]*fk_action/);
        expect(sql).to.match(/rank\s*=\s*1/);
        expect(sql).to.match(/EXTRACT\(\s*YEAR FROM [\w.]*date\s*\)\s+IN\s+\(:years\)/);
    });

    it('classe les lignes sur la clé de version partagée (alias cohérents avec la jointure sur action_metrics_versions)', async () => {
        await moveMetricsToVersion(actionId, versionId, [2022], transaction);

        expect(stubs.metricsVersionKey).to.have.been.called;
        const [metricsAlias, versionAlias] = stubs.metricsVersionKey.firstCall.args;
        const [sql] = stubs.sequelize.query.firstCall.args;

        expect(sql).to.match(new RegExp(`ORDER BY\\s+${KEY_MARKER}\\s+DESC`));
        expect(sql).to.match(new RegExp(`LEFT JOIN action_metrics_versions(\\s+AS)?\\s+${versionAlias}\\s+ON\\s+${metricsAlias}\\.fk_version\\s*=\\s*${versionAlias}\\.action_metrics_version_id`));
    });

    it('ne reçoit ni ne transmet aucun timestamp : replacements limités à actionId, versionId et years', async () => {
        await moveMetricsToVersion(actionId, versionId, [2022, 2024], transaction);

        const [sql, options] = stubs.sequelize.query.firstCall.args;
        expect(options.replacements).to.eql({ actionId, versionId, years: [2022, 2024] });
        Object.values(options.replacements).forEach(value => expect(value).not.to.be.instanceOf(Date));
        expect(sql).not.to.match(/:createdAt|:created_at|:versionAt|:version_at|:timestamp/);
    });

    it('exécute la requête de type UPDATE dans la transaction fournie', async () => {
        await moveMetricsToVersion(actionId, versionId, [2023], transaction);

        const [, options] = stubs.sequelize.query.firstCall.args;
        expect(options.type).to.equal('UPDATE');
        expect(options.transaction).to.equal(transaction);
    });

    it('accepte une seule année', async () => {
        await moveMetricsToVersion(actionId, versionId, [2023], transaction);

        expect(stubs.sequelize.query).to.have.been.calledOnce;
        expect(stubs.sequelize.query.firstCall.args[1].replacements).to.eql({ actionId, versionId, years: [2023] });
    });

    it('propage l\'erreur de la requête', async () => {
        stubs.sequelize.query.rejects(new Error('boom'));

        try {
            await moveMetricsToVersion(actionId, versionId, [2022], transaction);
            expect.fail('aurait dû lever une erreur');
        } catch (error) {
            expect((error as Error).message).to.equal('boom');
        }
    });
});
