import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `fetchReport/fetchReport.ts` (correctif « version des indicateurs »), en complément de fetchReport.spec.ts.
 *
 * Les 3 requêtes sur action_metrics (CTE `metrics`, `metrics_last_update`, `scolarmetrics`) utilisent la clé de version
 * partagée `_common/metricsVersionKey` (table non aliasée : premier argument = 'action_metrics') avec un
 * LEFT JOIN action_metrics_versions chacune :
 *  - metrics          : RANK ... ORDER BY <clé> DESC ;
 *  - scolarmetrics    : RANK ... ORDER BY action_metrics.date DESC, <clé> DESC ;
 *  - metrics_last_update : MAX(<clé>).
 */
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        query: sandbox.stub(),
    },
    metricsVersionKey: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
rewiremock('../fetch/enrichWhere').callThrough();
rewiremock('../_common/metricsVersionKey').with(stubs.metricsVersionKey);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetchReport from './fetchReport';
rewiremock.disable();

const KEY_MARKER = '__CLE_DE_VERSION__';

function countOccurrences(sql: string, pattern: RegExp): number {
    return (sql.match(pattern) || []).length;
}

describe('models/actionModel/fetchReport/fetchReport() - clé de version des indicateurs', () => {
    const YEAR = 2024;

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

    async function getSql(): Promise<string> {
        await fetchReport(YEAR);
        return stubs.sequelize.query.firstCall.args[0];
    }

    it('utilise la clé de version partagée exactement 3 fois (metrics, metrics_last_update, scolarmetrics)', async () => {
        const sql = await getSql();

        expect(countOccurrences(sql, new RegExp(KEY_MARKER, 'g'))).to.equal(3);
    });

    it('demande la clé sur la table action_metrics non aliasée', async () => {
        await getSql();

        expect(stubs.metricsVersionKey).to.have.been.called;
        stubs.metricsVersionKey.getCalls().forEach((call) => {
            expect(call.args[0]).to.equal('action_metrics');
            expect(call.args[1]).to.be.a('string').and.not.equal('');
        });
    });

    it('joint action_metrics_versions dans chacune des 3 requêtes avec l\'alias utilisé par la clé', async () => {
        const sql = await getSql();

        expect(countOccurrences(sql, /LEFT JOIN\s+action_metrics_versions/g)).to.equal(3);
        stubs.metricsVersionKey.getCalls().forEach((call) => {
            const versionAlias = call.args[1];
            expect(sql).to.match(new RegExp(`LEFT JOIN action_metrics_versions(\\s+AS)?\\s+${versionAlias}\\s+ON\\s+action_metrics\\.fk_version\\s*=\\s*${versionAlias}\\.action_metrics_version_id`));
        });
    });

    it('classe les indicateurs de l\'année (CTE metrics) sur la clé de version', async () => {
        const sql = await getSql();

        expect(sql).to.match(new RegExp(`PARTITION BY action_metrics\\.fk_action\\s+ORDER BY ${KEY_MARKER} DESC`));
    });

    it('classe les indicateurs scolaires (CTE scolarmetrics) par date décroissante puis par clé de version', async () => {
        const sql = await getSql();

        expect(sql).to.match(new RegExp(`ORDER BY action_metrics\\.date DESC,\\s*${KEY_MARKER} DESC`));
    });

    it('calcule metrics_last_update avec MAX de la clé de version sur toutes les lignes de l\'action', async () => {
        const sql = await getSql();

        expect(sql).to.match(new RegExp(`MAX\\(\\s*${KEY_MARKER}\\s*\\)\\s+AS\\s+last_metrics_update`));
        expect(sql).to.match(/mlu\.last_metrics_update AS "metrics_updated_at"/);
    });

    it('ne trie plus sur date_trunc(created_at) directement', async () => {
        const sql = await getSql();

        expect(sql).not.to.include('date_trunc(\'seconds\', action_metrics.created_at)');
        expect(sql).not.to.match(/MAX\(action_metrics\.created_at\)/);
    });

    it('ne change rien d\'autre : filtre d\'année avant le rang, rang = 1, filtres scolaires et fenêtre de dates', async () => {
        const sql = await getSql();

        expect(sql).to.include('TO_CHAR(action_metrics.date, \'YYYY\') = :annee::varchar');
        expect(countOccurrences(sql, /WHERE rank = 1/g)).to.equal(2);
        expect(sql).to.include('action_metrics.scolaire_nombre_autre IS NOT NULL');
        expect(sql).to.include('action_metrics.date <= TO_DATE(:annee || \'-09-01\', \'YYYY-MM-DD\') + INTERVAL \'1 year\'');
        expect(sql).to.include('action_metrics.date > TO_DATE(:annee || \'-12-31\', \'YYYY-MM-DD\') - INTERVAL \'1 year\'');
    });
});
