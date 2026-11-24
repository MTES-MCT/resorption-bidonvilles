import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

type CreatedVersionRow = { action_metrics_version_id: number };

export default async function createMetricsVersion(actionId: number, authorId: number, transaction: Transaction): Promise<number> {
    // version_at est calculée par la base (CURRENT_TIMESTAMP) : jamais de Date JavaScript ici, car elle serait tronquée
    // à la milliseconde alors que pg stocke des microsecondes, ce qui fausserait les comparaisons de versions
    const [rows] = await sequelize.query(
        `INSERT INTO action_metrics_versions(
            fk_action,
            version_at,
            version_by
        ) VALUES (
            :actionId,
            CURRENT_TIMESTAMP,
            :authorId
        )
        RETURNING action_metrics_version_id`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: { actionId, authorId },
        },
    ) as unknown as [CreatedVersionRow[], number];

    return rows[0].action_metrics_version_id;
}
