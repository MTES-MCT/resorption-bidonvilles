import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default function deleteOrphanMetricsVersions(actionId: number, transaction: Transaction): Promise<unknown> {
    return sequelize.query(
        `DELETE FROM action_metrics_versions
        WHERE fk_action = :actionId
        AND NOT EXISTS (
            SELECT 1
            FROM action_metrics
            WHERE action_metrics.fk_version = action_metrics_versions.action_metrics_version_id
        )`,
        {
            type: QueryTypes.DELETE,
            transaction,
            replacements: { actionId },
        },
    );
}
