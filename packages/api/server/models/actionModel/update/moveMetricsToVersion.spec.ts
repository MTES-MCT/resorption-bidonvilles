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

describe('models/actionModel/update/moveMetricsToVersion() - matérialisation des dates de mise à jour par nature (issue 2739)', () => {
    const actionId = 7;
    const versionId = 42;
    const transaction = {} as any;

    function normalize(sql: string): string {
        return sql.replace(/\s+/g, ' ').trim();
    }

    // Extrait l'affectation `colonne = COALESCE(...)` de la clause SET (parenthèses équilibrées)
    function extractCoalesce(sql: string, column: string): string | null {
        const normalized = normalize(sql);
        const start = normalized.match(new RegExp(`(?:SET|,)\\s*${column}\\s*=\\s*COALESCE\\s*\\(`));
        if (!start || start.index === undefined) {
            return null;
        }

        const openIndex = start.index + start[0].length - 1;
        let depth = 0;
        for (let i = openIndex; i < normalized.length; i += 1) {
            if (normalized[i] === '(') {
                depth += 1;
            } else if (normalized[i] === ')') {
                depth -= 1;
                if (depth === 0) {
                    return normalized.slice(openIndex + 1, i);
                }
            }
        }

        return null;
    }

    function getSetClause(sql: string): string {
        const normalized = normalize(sql);
        const match = normalized.match(/\bSET\b(.*?)\bWHERE action_metrics\.fk_action = :actionId/);
        return match ? match[1] : '';
    }

    beforeEach(() => {
        stubs.sequelize.query.resolves();
        stubs.metricsVersionKey.returns(KEY_MARKER);
    });

    // Le `after` du describe précédent restaure la sandbox : ses stubs n'en font alors plus partie, on les réinitialise donc explicitement.
    afterEach(() => {
        stubs.sequelize.query.reset();
        stubs.metricsVersionKey.reset();
    });

    ['updated_at_indicators', 'updated_at_scolaire'].forEach((column) => {
        describe(column, () => {
            it('est affectée dans le même UPDATE que fk_version, par un COALESCE', async () => {
                await moveMetricsToVersion(actionId, versionId, [2022], transaction);

                expect(stubs.sequelize.query).to.have.been.calledOnce;
                const [sql] = stubs.sequelize.query.firstCall.args;
                const setClause = getSetClause(sql);

                expect(setClause).to.match(/fk_version\s*=\s*:versionId/);
                expect(setClause).to.match(new RegExp(`${column}\\s*=\\s*COALESCE\\s*\\(`));
            });

            it('est matérialisée dans l\'ordre : la colonne elle-même, la version_at de l\'ancienne version, puis created_at', async () => {
                await moveMetricsToVersion(actionId, versionId, [2022], transaction);

                const [sql] = stubs.sequelize.query.firstCall.args;
                const expression = extractCoalesce(sql, column);

                expect(expression, `COALESCE introuvable pour ${column}`).not.to.be.null;
                const selfIndex = expression!.search(new RegExp(`^\\s*(action_metrics\\.)?${column}\\s*,`));
                const subqueryIndex = expression!.search(/\(\s*SELECT\s+\w+\.version_at\s+FROM\s+action_metrics_versions/i);
                const createdAtIndex = expression!.search(/,\s*action_metrics\.created_at\s*$/);

                expect(selfIndex, 'la colonne elle-même doit venir en premier').to.equal(0);
                expect(subqueryIndex, 'sous-requête version_at').to.be.greaterThan(selfIndex);
                expect(createdAtIndex, 'created_at en dernier').to.be.greaterThan(subqueryIndex);
            });

            it('lit l\'ancienne version via action_metrics.fk_version (jamais :versionId) dans la sous-requête', async () => {
                await moveMetricsToVersion(actionId, versionId, [2022], transaction);

                const [sql] = stubs.sequelize.query.firstCall.args;
                const expression = extractCoalesce(sql, column);

                expect(expression, `COALESCE introuvable pour ${column}`).not.to.be.null;
                expect(expression).to.match(/FROM\s+action_metrics_versions(\s+AS)?\s+(\w+)\s+WHERE\s+\2\.action_metrics_version_id\s*=\s*action_metrics\.fk_version\b/i);
                expect(expression).not.to.contain(':versionId');
                expect(expression).not.to.match(/:\w+/);
            });
        });
    });

    it('ne référence :versionId qu\'une seule fois, pour l\'affectation de fk_version', async () => {
        await moveMetricsToVersion(actionId, versionId, [2022], transaction);

        const [sql] = stubs.sequelize.query.firstCall.args;
        expect(normalize(sql).match(/:versionId/g)).to.have.lengthOf(1);
    });

    it('laisse les replacements inchangés ({ actionId, versionId, years }), sans timestamp JS', async () => {
        await moveMetricsToVersion(actionId, versionId, [2022, 2024], transaction);

        const [, options] = stubs.sequelize.query.firstCall.args;
        expect(options.replacements).to.eql({ actionId, versionId, years: [2022, 2024] });
        Object.values(options.replacements).forEach(value => expect(value).not.to.be.instanceOf(Date));
    });

    it('conserve la sélection des lignes (rang 1 par clé de version, année dans :years)', async () => {
        await moveMetricsToVersion(actionId, versionId, [2022, 2024], transaction);

        const sql = normalize(stubs.sequelize.query.firstCall.args[0]);
        expect(sql).to.match(/RANK\(\) OVER\(/);
        expect(sql).to.match(new RegExp(`ORDER BY ${KEY_MARKER} DESC`));
        expect(sql).to.match(/rank\s*=\s*1/);
        expect(sql).to.match(/EXTRACT\(\s*YEAR FROM [\w.]*date\s*\) IN \(:years\)/);
    });

    it('n\'exécute aucune requête quand la liste d\'années est vide', async () => {
        await moveMetricsToVersion(actionId, versionId, [], transaction);

        expect(stubs.sequelize.query).not.to.have.been.called;
    });
});
