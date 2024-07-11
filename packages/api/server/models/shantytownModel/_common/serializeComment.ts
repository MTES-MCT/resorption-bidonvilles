import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import { ShantytownCommentTag } from '#root/types/resources/ShantytownCommentTag.d';
import { ShantytownCommentRow } from '../../shantytownCommentModel/ShantytownCommentRow.d';

type shantytownCommentRowWithTags = ShantytownCommentRow & {
    tags: ShantytownCommentTag[]
};

export default (comment: shantytownCommentRowWithTags): ShantytownRawComment => ({
    id: comment.commentId,
    description: comment.commentDescription,
    createdAt: comment.commentCreatedAt !== null ? (comment.commentCreatedAt.getTime() / 1000) : null,
    organization_target_name: comment.organization_target_name || [],
    user_target_name: comment.user_target_name || [],
    createdBy: {
        id: comment.commentCreatedBy,
        first_name: comment.userFirstName,
        last_name: comment.userLastName,
        position: comment.userPosition,
        organization: comment.organizationAbbreviation || comment.organizationName,
        organization_id: comment.organizationId,
    },
    shantytown: comment.shantytownId,
    tags: comment.tags,
    attachments: comment.attachments?.length ? comment.attachments : [],
});
