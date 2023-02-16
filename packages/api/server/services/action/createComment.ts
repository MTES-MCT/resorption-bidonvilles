import actionModel from '#server/models/actionModel/index';
import ServiceError from '#server/errors/ServiceError';
import Action, { Comment } from '#server/models/actionModel/fetch/Action.d';
import sendMattermostNotification from './createComment.sendMattermostNotification';
import sendMailNotifications from './createComment.sendMailNotifications';

type ActionCommentInput = {
    description: string
};

export default async (authorId: number, action: Action, commentInput: ActionCommentInput): Promise<Comment> => {
    let comment;
    try {
        comment = await actionModel.createComment(action.id, {
            ...commentInput,
            created_by: authorId,
        });
    } catch (error) {
        throw new ServiceError('write_fail', error);
    }

    try {
        await Promise.all([
            sendMattermostNotification(action, comment),
            sendMailNotifications(action, comment),
        ]);
    } catch (error) {
        // ignore
    }

    return comment;
};
