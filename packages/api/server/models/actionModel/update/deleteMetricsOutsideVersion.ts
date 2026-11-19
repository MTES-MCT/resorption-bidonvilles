import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default function deleteMetricsOutsideVersion(actionId: number, versionId: number, transaction: Transaction): Promise<unknown> {
    // IS DISTINCT FROM (et non <>) pour supprimer aussi les lignes sans version (fk_version NULL)
    return sequelize.query(
        `DELETE FROM action_metrics
        WHERE fk_action = :actionId
        AND fk_version IS DISTINCT FROM :versionId`,
        {
            type: QueryTypes.DELETE,
            transaction,
            replacements: { actionId, versionId },
        },
    );
}
