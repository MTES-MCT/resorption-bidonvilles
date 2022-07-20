
const shantytownCommentModel = require('#server/models/shantytownCommentModel');
const shantytownModel = require('#server/models/shantytownModel');
const shantytownCommentTagModel = require('#server/models/shantytownCommentTagModel');
const mattermostUtils = require('#server/utils/mattermost');

const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');
const ServiceError = require('#server/errors/ServiceError');
const sequelize = require('#db/sequelize');

/**
 * @param {Service_ShantytownComment_Create_CommentData} comment Commentaire
 * @param {Model_Shantytown} shantytown site rattaché au commentaire
 * @param {Model_User} author Auteur du commentaire
 *
 * @returns {Array.<Model_ShantytownComment>}
 */
module.exports = async (comment, shantytown, author) => {
    // on insère le commentaire
    let commentId;
    let transaction;
    try {
        transaction = await sequelize.transaction();
        // Insérer le commentaire dans la table shantytown_comments
        commentId = await shantytownCommentModel.create({
            description: comment.description,
            targets: comment.targets,
            fk_shantytown: shantytown.id,
            created_by: author.id,
        }, transaction);
        // Insérer les tags du commentaire dans la table shantytown_comment_tags
        const { tags } = comment;
        if (tags.length > 0) {
            // Enregistrement des tags dans la table shantytown_comment_tags
            await shantytownCommentTagModel.create(commentId, tags.map(tag => tag.uid), transaction);
        }
        await transaction.commit();
    } catch (error) {
        transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }

    // on tente d'envoyer une notification Mattermost
    try {
        await mattermostUtils.triggerNewComment(comment.description, comment.tags.map(tag => tag.label), shantytown, author);
    } catch (error) {
        // ignore
    }

    // on retourne la liste mise à jour des commentaires du site
    let regularComments;
    let covidComments;
    try {
        [regularComments, covidComments] = await Promise.all([
            shantytownModel.getComments(author, [shantytown.id], false),
            shantytownModel.getComments(author, [shantytown.id], true),
        ]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // on tente d'envoyer une notification mail à tous les intervenants du site
    try {
        const watchers = await userModel.getShantytownWatchers(
            shantytown.id,
            commentId,
            comment.targets.organizations.length > 0 || comment.targets.users.length > 0,
        );

        if (watchers.length > 0) {
            const serializedComment = await shantytownCommentModel.findOne(commentId);
            // On prépare l'affichage des tags qualifiant le commentaire
            let tag_text = '';
            const tags_length = serializedComment.tags.length;
            if (tags_length > 0) {
                tag_text = serializedComment.tags.length > 1 ? 'ces étiquettes' : 'cette étiquette';
            }
            await Promise.all(
                watchers.map(user => mails.sendUserNewComment(
                    user,
                    {
                        variables: {
                            shantytown,
                            comment: serializedComment,
                            tags: comment.tags.map(tag => tag.label),
                            tags_length,
                            tag_text,
                        },
                    },
                )),
            );
        }
    } catch (error) {
        // ignore
    }

    return {
        regular: regularComments[shantytown.id] || [],
        covid: covidComments[shantytown.id] || [],
    };
};
