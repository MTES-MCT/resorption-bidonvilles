import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import createComment from '#server/models/actionModel/createComment/createComment';
import fetchComments from '#server/models/actionModel/fetchComments/fetchComments';
import serializeComment from '#server/models/actionModel/fetchComments/serializeComment';
import uploadAttachments from '#server/services/attachment/upload';
import sendMattermostNotification from './createComment.sendMattermostNotification';
import sendMailNotifications from './createComment.sendMailNotifications';
import { ActionRawComment } from '#root/types/resources/ActionCommentRaw.d';
import Action from '#root/types/resources/Action.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';

type ActionCommentInput = {
    description: string,
    files: any[]
};

export default async (authorId: number, action: Action, commentInput: ActionCommentInput): Promise<any> => {
    let comment: ActionRawComment;
    let commentId: number;
    let transaction: Transaction;

    try {
        transaction = await sequelize.transaction();
        commentId = await createComment(action.id, {
            description: commentInput.description,
            created_by: authorId,
        }, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }

    // on tente d'enregistrer les fichiers joints
    if (commentInput.files.length > 0) {
        try {
            await uploadAttachments(
                'action_comment',
                commentId,
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
        const [commentRow] = await fetchComments(null, [commentId], {}, transaction);
        comment = serializeComment(commentRow);
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

    // On récupère les fichiers joints avec les liens signés
    const commentWithEnrichedAttachments = await enrichCommentsAttachments(comment);

    // on tente d'envoyer un mail aux acteurs concernés
    let numberOfObservers = 0;
    try {
        numberOfObservers = await sendMailNotifications(action, comment);
    } catch (error) {
        // ignore
    }

    return { comment: commentWithEnrichedAttachments, numberOfObservers };
};
