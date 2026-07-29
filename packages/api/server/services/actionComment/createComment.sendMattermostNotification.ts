import mattermostUtils from '#server/utils/mattermost';
import Action, { Comment } from '#root/types/resources/Action.d';

export default async (action: Action, comment: Comment): Promise<void> => mattermostUtils.triggerNewActionComment(
    comment.description,
    action,
    comment.createdBy,
);
