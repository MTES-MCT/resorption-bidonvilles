
const planCommentModel = require('#server/models/planCommentModel');
const planModel = require('#server/models/planModel');
const mattermostUtils = require('#server/utils/mattermost');

const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');
const ServiceError = require('#server/errors/ServiceError');

/**
 * @param {Service_PlanComment_Create_CommentData} comment Commentaire
 * @param {Model_Plan} plan action rattaché au commentaire
 * @param {Model_User} author Auteur du commentaire
 *
 * @returns {Array.<Model_PlanComment>}
 */
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
        await mattermostUtils.triggerNewPlanComment(comment.description, plan, author); // TODO : create triggerNewPlanComment
    } catch (error) {
        // ignore
    }

    // on retourne la liste mise à jour des commentaires de l'action
    let planComments;
    try {
        [planComments] = await Promise.all([
            planModel.getComments(author, [plan.id]),
        ]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // on tente d'envoyer une notification mail à tous les intervenants et correspondants de l'action
    try {
        const watchers = await userModel.getPlanWatchers( // TODO : modèle à créer
            plan.id,
            commentId,
        );

        if (watchers.length > 0) {
            const serializedComment = await planCommentModel.findOne(commentId);
            await Promise.all(
                watchers.map(user => mails.sendUserNewPlanComment(user, { variables: { plan, comment: serializedComment } })), // TODO mail send à créer
            );
        }
    } catch (error) {
        // ignore
    }


    return planComments[plan.id];
};
