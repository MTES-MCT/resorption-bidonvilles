import serializeAttachment from '#server/services/attachment/serializeAttachment';
import ServiceError from '#server/errors/ServiceError';
import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

export default async (comment: ShantytownRawComment): Promise<ShantytownEnrichedComment> => {
    try {
        let enrichedComment: ShantytownEnrichedComment | null = null;
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
