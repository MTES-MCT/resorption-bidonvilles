import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `fetch/fetchMetrics.ts` (correctif « version des indicateurs »).
 *
 *  - jointure LEFT JOIN action_metrics_versions sur action_metrics.fk_version ;
 *  - le rang (RANK, PARTITION BY fk_action) est calculé sur la clé de version partagée `_common/metricsVersionKey`
 *    (la table action_metrics n'est pas aliasée : premier argument = 'action_metrics') ;
 *  - nouvelle colonne `version_at` = COALESCE(version.version_at, action_metrics.created_at), NON tronquée ;
 *  - created_at est toujours sélectionné.
 */
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        query: sandbox.stub(),
    },
    metricsVersionKey: sandbox.stub(),
};

rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('./enrichWhere').callThrough();
rewiremock('../_common/metricsVersionKey').with(stubs.metricsVersionKey);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetchMetrics from './fetchMetrics';
rewiremock.disable();

const KEY_MARKER = '__CLE_DE_VERSION__';

describe('models/actionModel/fetch/fetchMetrics()', () => {
    const transaction = {} as any;

    beforeEach(() => {
        stubs.sequelize.query.resolves([]);
        stubs.metricsVersionKey.returns(KEY_MARKER);
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    function lastSql(): string {
        return stubs.sequelize.query.firstCall.args[0];
    }

    it('rattache chaque ligne à sa version par un LEFT JOIN sur action_metrics_versions', async () => {
        await fetchMetrics([1]);

        const versionAlias = stubs.metricsVersionKey.firstCall.args[1];
        expect(stubs.metricsVersionKey.firstCall.args[0]).to.equal('action_metrics');
        expect(lastSql()).to.match(new RegExp(`LEFT JOIN action_metrics_versions(\\s+AS)?\\s+${versionAlias}\\s+ON\\s+action_metrics\\.fk_version\\s*=\\s*${versionAlias}\\.action_metrics_version_id`));
    });

    it('calcule le rang par action sur la clé de version partagée', async () => {
        await fetchMetrics([1]);

        expect(lastSql()).to.match(new RegExp(`RANK\\(\\)\\s+OVER\\s*\\(\\s*PARTITION BY\\s+action_metrics\\.fk_action\\s+ORDER BY\\s+${KEY_MARKER}\\s+DESC\\s*\\)\\s+AS\\s+rank`));
    });

    it('n\'utilise plus date_trunc sur created_at pour le rang', async () => {
        await fetchMetrics([1]);

        expect(lastSql()).not.to.include('date_trunc(\'seconds\', action_metrics.created_at)');
    });

    it('expose la colonne version_at non tronquée (COALESCE de la date de version et du created_at)', async () => {
        await fetchMetrics([1]);

        const versionAlias = stubs.metricsVersionKey.firstCall.args[1];
        expect(lastSql()).to.match(new RegExp(`COALESCE\\(\\s*${versionAlias}\\.version_at\\s*,\\s*action_metrics\\.created_at\\s*\\)\\s+AS\\s+version_at\\b`));
    });

    it('continue de sélectionner created_at', async () => {
        await fetchMetrics([1]);

        expect(lastSql()).to.match(/action_metrics\.created_at,/);
    });

    it('conserve le filtre sur les actions, le tri par date et les options de requête', async () => {
        await fetchMetrics([1, 2], {}, transaction);

        const [sql, options] = stubs.sequelize.query.firstCall.args;
        expect(sql).to.include('action_metrics.fk_action IN (:actionIds)');
        expect(sql).to.match(/ORDER BY action_metrics\.date DESC/);
        expect(options.type).to.equal('SELECT');
        expect(options.replacements).to.eql({ actionIds: [1, 2] });
        expect(options.transaction).to.equal(transaction);
    });

    it('retourne les lignes renvoyées par la requête', async () => {
        const rows = [{ action_id: 1, rank: 1 }];
        stubs.sequelize.query.resolves(rows);

        expect(await fetchMetrics([1])).to.equal(rows);
    });
});
