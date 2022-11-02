
import planCommentModel from '#server/models/planCommentModel';
import mattermostUtils from '#server/utils/mattermost';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';

export default async (comment, plan, author) => {
    // on insère le commentaire
    let commentId;
    try {
        commentId = await planCommentModel.create({
            description: comment.description,
            fk_plan: plan.id,
            created_by: author.id,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on tente d'envoyer une notification Mattermost
    try {
        await mattermostUtils.triggerNewPlanComment(comment.description, plan, author);
    } catch (error) {
        // ignore
    }

    // on retourne le commentaire
    let serializedComment;
    try {
        serializedComment = await planCommentModel.findOne(commentId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // on tente d'envoyer une notification mail à tous les intervenants et correspondants de l'action
    try {
        const observers = await userModel.getPlanObservers(
            plan.id,
            commentId,
        );

        if (observers.length > 0) {
            await Promise.all(
                observers.map(user => mails.sendUserNewPlanComment(user, { variables: { plan, comment: serializedComment } })),
            );
        }
    } catch (error) {
        // ignore
    }


    return serializedComment;
};
