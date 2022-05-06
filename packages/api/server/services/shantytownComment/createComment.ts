import shantytownCommentModelFactory from '#server/models/shantytownCommentModel';
import shantytownModelFactory from '#server/models/shantytownModel';
import userModelFactory from '#server/models/userModel';
import mattermostUtils from '#server/utils/mattermost';
import mails from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';

const shantytownCommentModel = shantytownCommentModelFactory();
const shantytownModel = shantytownModelFactory();
const userModel = userModelFactory();

/**
 * @param {Service_ShantytownComment_Create_CommentData} comment Commentaire
 * @param {Model_Shantytown} shantytown site rattaché au commentaire
 * @param {Model_User} author Auteur du commentaire
 *
 * @returns {Array.<Model_ShantytownComment>}
 */
export default async (comment, shantytown, author) => {
    // on insère le commentaire
    let commentId;
    try {
        commentId = await shantytownCommentModel.create({
            description: comment.description,
            private: comment.private,
            fk_shantytown: shantytown.id,
            created_by: author.id,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on tente d'envoyer une notification Mattermost
    try {
        await mattermostUtils.triggerNewComment(comment.description, shantytown, author);
    } catch (error) {
        // ignore
    }

    // on retourne la liste mise à jour des commentaires du site
    let comments;
    try {
        comments = await shantytownModel.getComments(author, [shantytown.id], false);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // on tente d'envoyer une notification mail à tous les intervenants du site
    try {
        const watchers = await userModel.getShantytownWatchers(shantytown.id, comment.private);
        if (watchers.length > 0) {
            const serializedComment = await shantytownCommentModel.findOne(commentId);
            await Promise.all(
                watchers.map(user => mails.sendUserNewComment(user, { variables: { shantytown, comment: serializedComment } })),
            );
        }
    } catch (error) {
        // ignore
    }

    return comments[shantytown.id];
};
