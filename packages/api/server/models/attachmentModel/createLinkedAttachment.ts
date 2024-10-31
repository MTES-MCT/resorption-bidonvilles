import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import create from './create';
import { ShantytownAttachmentObject } from '#root/types/resources/Shantytown.d';

export type AttachmentEntityType = 'shantytown_comment' | 'shantytown_decree' | 'action_comment' | 'question' | 'answer';

export default async (
    entityType: AttachmentEntityType,
    entityId: number,
    key: string,
    previewKey: string,
    name: string,
    mimetype: string,
    size: number,
    authorId: number,
    argTransaction?: Transaction,
    shantytownAttachment?: ShantytownAttachmentObject,
): Promise<void> => {
    const transaction = argTransaction || await sequelize.transaction();

    try {
        let query: string;
        if (entityType === 'shantytown_decree') { // Cas particulier des PJ liées aux arrêtés
            query = 'INSERT INTO shantytown_decree_attachments (fk_shantytown, fk_attachment, attachment_type) VALUES (:entityId, :attachmentId, :decreeType)';
        } else {
            query = `INSERT INTO ${entityType}_attachments (fk_${entityType}, fk_attachment) VALUES(:entityId, :attachmentId)`;
        }
        const attachmentId = await create(key, previewKey, name, mimetype, size, authorId, transaction);
        await sequelize.query(
            query,
            {
                transaction,
                type: QueryTypes.INSERT,
                replacements:
                entityType === 'shantytown_decree' ? {
                    entityId,
                    attachmentId,
                    decreeType: shantytownAttachment.decreeType,
                } : {
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
