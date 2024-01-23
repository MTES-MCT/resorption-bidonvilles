import actionModel from '#server/models/actionModel/index';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import attachmentService from '#server/services/attachment';
import Action, { Comment } from '#root/types/resources/Action.d';
import sendMattermostNotification from './createComment.sendMattermostNotification';
import sendMailNotifications from './createComment.sendMailNotifications';

type ActionCommentInput = {
    description: string,
    files: any[]
};

export default async (authorId: number, action: Action, commentInput: ActionCommentInput): Promise<any> => {
    let comment: Comment;
    let transaction;

    try {
        transaction = await sequelize.transaction();
        comment = await actionModel.createComment(action.id, {
            description: commentInput.description,
            created_by: authorId,
        });
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('write_fail', error);
    }

    // on tente d'enregistrer les fichiers joints
    if (commentInput.files.length > 0) {
        try {
            await attachmentService.upload(
                'action_comment',
                comment.id,
                authorId,
                commentInput.files,
                transaction,
            );
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError('upload_failed', error);
        }
    }

    // on finalise
    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', error);
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
