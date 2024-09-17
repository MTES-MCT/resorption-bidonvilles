import { Attachment } from '#server/services/attachment/Attachment.d';
import { ShantytownGenericComment } from '#root/types/resources/ShantytownCommentGeneric.d';

export type ShantytownEnrichedComment = ShantytownGenericComment & {
    attachments: Attachment[];
};
