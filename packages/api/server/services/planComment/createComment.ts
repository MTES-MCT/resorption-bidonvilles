
const planCommentModel = require('#server/models/planCommentModel');
const mattermostUtils = require('#server/utils/mattermost');

const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (comment, plan, author) => {
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
