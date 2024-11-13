import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import { ShantytownDecree } from './shantytownDecrees.d';

export default (shantytownIds: number, transaction: Transaction = undefined): Promise<ShantytownDecree[]> => {
    const ids: number[] = Array.isArray(shantytownIds) ? shantytownIds : [shantytownIds];

    return sequelize.query(
        `SELECT
            sd.fk_shantytown AS "shantytownId",
            sd.fk_attachment AS "attachmentId",
            sd.attachment_type AS "attachmentType",
            a.original_file_key AS "fileKey",
            a.preview_file_key AS "previewFileKey",
            a.original_name AS "originalName",
            a.mimetype AS "type",
            a.size AS "size",
            a.created_by AS "createdBy",
            a.created_at AS "createdAt"
        FROM
            shantytown_decree_attachments sd
        LEFT JOIN attachments a ON sd.fk_attachment = a.attachment_id
        WHERE sd.fk_shantytown IN (:ids)
        ORDER BY a.created_at DESC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ids,
            },
            transaction,
        },
    );
};
