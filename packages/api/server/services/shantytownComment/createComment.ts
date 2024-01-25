
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentTagModel from '#server/models/shantytownCommentTagModel';
import attachmentService from '#server/services/attachment';
import mattermostUtils from '#server/utils/mattermost';

import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';

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
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }

    // on tente d'enregistrer les fichiers joints
    if (comment.files.length > 0) {
        try {
            await attachmentService.upload(
                'shantytown_comment',
                commentId,
                author.id,
                comment.files,
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

    // on tente d'envoyer une notification Mattermost
    try {
        await mattermostUtils.triggerNewComment(comment.description, comment.tags.map(tag => tag.label), shantytown, author);
    } catch (error) {
        // ignore
    }

    // on retourne la liste mise à jour des commentaires du site
    let comments;
    try {
        comments = await shantytownModel.getComments(author, [shantytown.id]);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    // on tente d'envoyer une notification mail à tous les intervenants du site
    let watchers;
    try {
        watchers = await userModel.getShantytownWatchers(commentId);

        if (watchers.length > 0) {
            const serializedComment = await shantytownCommentModel.findOne(commentId);
            await Promise.all(
                watchers.map(user => mails.sendUserNewComment(
                    user,
                    {
                        variables: {
                            shantytown,
                            comment: serializedComment,
                        },
                    },
                )),
            );
        }
    } catch (error) {
        // ignore
    }

    return {
        comments: comments[shantytown.id] || [],
        numberOfWatchers: watchers.length,
    };
};
