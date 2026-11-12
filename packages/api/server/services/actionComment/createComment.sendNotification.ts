import tchapUtils from '#server/utils/tchap';
import Action, { Comment } from '#root/types/resources/Action.d';

export default async function sendNotification(action: Action, comment: Comment): Promise<void> {
    await tchapUtils.triggerNewActionComment(
        comment.description,
        action,
        comment.createdBy,
    );
}
