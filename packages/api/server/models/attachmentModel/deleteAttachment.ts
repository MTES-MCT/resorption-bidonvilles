import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default (attachmentId: number, transaction: Transaction = undefined): Promise<void> => sequelize.query(
    'DELETE FROM attachments WHERE attachment_id = :attachmentId',
    {
        type: QueryTypes.DELETE,
        replacements: { attachmentId },
        transaction,
    },
);
