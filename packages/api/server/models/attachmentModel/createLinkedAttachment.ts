import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import create from './create';

export type AttachmentEntityType = 'shantytown_comment' | 'action_comment' | 'question' | 'answer';

export default async (entityType: AttachmentEntityType, entityId: number, key: string, name: string, mimetype: string, size: number, authorId: number, argTransaction?: Transaction): Promise<void> => {
    const transaction = argTransaction || await sequelize.transaction();

    try {
        const attachmentId = await create(key, name, mimetype, size, authorId, transaction);
        await sequelize.query(
            `INSERT INTO ${entityType}_attachments(fk_${entityType}, fk_attachment) VALUES(:entityId, :attachmentId)`,
            {
                transaction,
                type: QueryTypes.INSERT,
                replacements: {
                    entityId,
                    attachmentId,
                },
            },
        );
    } catch (e) {
        if (!argTransaction) {
            await transaction.rollback();
        }

        throw e;
    }

    if (!argTransaction) {
        await transaction.commit();
    }
};
