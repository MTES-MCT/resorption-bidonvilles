import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import metricsVersionKey from '../_common/metricsVersionKey';

export default async function moveMetricsToVersion(actionId: number, versionId: number, years: number[], transaction: Transaction): Promise<void> {
    if (years.length === 0) {
        return;
    }

    // Les lignes à rattacher sont identifiées entièrement en SQL (rang 1 de l'action + année), et non à partir d'un
    // created_at renvoyé par JavaScript : pg stocke des microsecondes, JS des millisecondes, la comparaison échouerait.
    // La clé primaire d'action_metrics étant (fk_action, date, created_at), la sous-requête renvoie les trois colonnes
    // pour ne cibler que les lignes de rang 1 et jamais une ancienne version de la même année.
    await sequelize.query(
        `UPDATE action_metrics
        SET fk_version = :versionId
        WHERE action_metrics.fk_action = :actionId
        AND (action_metrics.fk_action, action_metrics.date, action_metrics.created_at) IN (
            SELECT
                ranked.fk_action,
                ranked.date,
                ranked.created_at
            FROM (
                SELECT
                    am.fk_action,
                    am.date,
                    am.created_at,
                    RANK() OVER(
                        PARTITION BY am.fk_action
                        ORDER BY ${metricsVersionKey('am', 'amv')} DESC
                    ) AS rank
                FROM action_metrics AS am
                LEFT JOIN action_metrics_versions AS amv ON am.fk_version = amv.action_metrics_version_id
                WHERE am.fk_action = :actionId
            ) AS ranked
            WHERE ranked.rank = 1
            AND EXTRACT(YEAR FROM ranked.date) IN (:years)
        )`,
        {
            type: QueryTypes.UPDATE,
            transaction,
            replacements: { actionId, versionId, years },
        },
    );
}
