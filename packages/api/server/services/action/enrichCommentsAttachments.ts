import serializeAttachment from '#server/services/attachment/serializeAttachment';
import ServiceError from '#server/errors/ServiceError';
import { ActionRawComment } from '#root/types/resources/ActionCommentRaw.d';
import { ActionEnrichedComment } from '#root/types/resources/ActionCommentEnriched.d';

export default async (comment: ActionRawComment): Promise<ActionEnrichedComment> => {
    try {
        let enrichedComment: ActionEnrichedComment | null = null;
        const { attachments, ...commentWithoutAttachments } = comment;
        const enrichedAttachments = await Promise.all((attachments || []).map(attachment => serializeAttachment(attachment)));

        enrichedComment = {
            ...commentWithoutAttachments,
            attachments: enrichedAttachments,
        };

        if (enrichedComment === null) {
            throw new ServiceError('fetch_failed', new Error('Impossible de retrouver le commentaire en base de données'));
        }

        return enrichedComment;
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
