import { ActionGenericComment } from '#root/types/resources/ActionCommentGeneric.d';

export type ActionRawComment = ActionGenericComment & {
    attachments: string[]
};
