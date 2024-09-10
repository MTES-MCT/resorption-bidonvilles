import { Attachment } from '#server/services/attachment/Attachment.d';
import { ActionGenericComment } from '#root/types/resources/ActionCommentGeneric.d';

export type ActionEnrichedComment = ActionGenericComment & {
    attachments: Attachment[]
};
