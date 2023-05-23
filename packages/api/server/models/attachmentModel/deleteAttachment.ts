import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default (attachmentId: number, transaction = undefined): Promise<void> => sequelize.query(
    'DELETE FROM attachments WHERE attachment_id = :attachmentId',
    {
        type: QueryTypes.DELETE,
        replacements: { attachmentId },
        transaction,
    },
);
