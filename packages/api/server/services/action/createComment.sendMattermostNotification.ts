import Action, { Comment } from '#server/models/actionModel/fetch/Action.d';
import mattermostUtils from '#server/utils/mattermost';

export default async (action: Action, comment: Comment): Promise<void> => mattermostUtils.triggerNewActionComment(
    comment.description,
    action,
    comment.createdBy,
);
