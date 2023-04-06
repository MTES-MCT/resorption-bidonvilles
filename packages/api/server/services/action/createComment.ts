import actionModel from '#server/models/actionModel/index';
import ServiceError from '#server/errors/ServiceError';
import Action from '#server/models/actionModel/fetch/Action.d';
import sendMattermostNotification from './createComment.sendMattermostNotification';
import sendMailNotifications from './createComment.sendMailNotifications';

type ActionCommentInput = {
    description: string
};

export default async (authorId: number, action: Action, commentInput: ActionCommentInput): Promise<any> => {
    let comment;
    try {
        comment = await actionModel.createComment(action.id, {
            ...commentInput,
            created_by: authorId,
        });
    } catch (error) {
        throw new ServiceError('write_fail', error);
    }

    // on tente d'envoyer une notification mattermost
    try {
        await sendMattermostNotification(action, comment);
    } catch (error) {
    // ignore
    }

    // on tente d'envoyer un mail aux acteurs concernés
    let numberOfObservers = 0;
    try {
        numberOfObservers = await sendMailNotifications(action, comment);
    } catch (error) {

        // ignore
    }

    return { comment, numberOfObservers };
};
