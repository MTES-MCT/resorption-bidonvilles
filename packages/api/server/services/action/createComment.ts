import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import createComment from '#server/models/actionModel/createComment/createComment';
import fetchComments from '#server/models/actionModel/fetchComments/fetchComments';
import serializeComment from '#server/models/actionModel/fetchComments/serializeComment';
import uploadAttachments from '#server/services/attachment/upload';
import scanAttachmentErrors from '#server/services/attachment/scanAttachmentErrors';
import { ActionRowComment } from '#server/models/actionModel/fetchComments/ActionCommentRow.d';
import sendMattermostNotification from './createComment.sendMattermostNotification';
import sendMailNotifications from './createComment.sendMailNotifications';
import { ActionRawComment } from '#root/types/resources/ActionCommentRaw.d';
import Action from '#root/types/resources/Action.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';
import { ActionEnrichedComment } from '#root/types/resources/ActionCommentEnriched.d';

type ActionCommentInput = {
    description: string,
    files: any[]
};

export default async (authorId: number, action: Action, commentInput: ActionCommentInput): Promise<{ comment: ActionEnrichedComment, numberOfObservers: number }> => {
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
            throw new ServiceError(error?.message ?? '500', scanAttachmentErrors[error?.message]?.message ?? 'upload_failed');
        }
    }

    // on finalise
    try {
        const [commentRow]: ActionRowComment[] = await fetchComments(null, [commentId], {}, transaction);
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
        // eslint-disable-next-line no-console
        console.error(error);
    }

    // On récupère les fichiers joints avec les liens signés
    const commentWithEnrichedAttachments: ActionEnrichedComment = await enrichCommentsAttachments(comment);

    // on tente d'envoyer un mail aux acteurs concernés
    let numberOfObservers: number = 0;
    try {
        numberOfObservers = await sendMailNotifications(action, comment);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return { comment: commentWithEnrichedAttachments, numberOfObservers };
};
