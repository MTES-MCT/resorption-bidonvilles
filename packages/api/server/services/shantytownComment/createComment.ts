import { sequelize } from '#db/sequelize';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentTagModel from '#server/models/shantytownCommentTagModel';
import attachmentService from '#server/services/attachment';
import scanAttachmentErrors from '#server/services/attachment/scanAttachmentErrors';
import userModel from '#server/models/userModel';


import mattermostUtils from '#server/utils/mattermost';
import mails from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';
import { ShantytownRawComment } from '#root/types/resources/ShantytownCommentRaw.d';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

import { ShantytownCommentTag } from '#root/types/resources/ShantytownCommentTag.d';
import enrichCommentsAttachments from '../shantytown/_common/enrichCommentsAttachments';

export default async (comment, shantytown, author): Promise<{ comments: ShantytownEnrichedComment[], numberOfWatchers: number } > => {
    // on insère le commentaire
    let commentId: number;
    const transaction = await sequelize.transaction();
    try {
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
            await shantytownCommentTagModel.create(commentId, tags.map((tag: ShantytownCommentTag) => tag.uid), transaction);
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
            throw new ServiceError(error?.message || '500', scanAttachmentErrors[error?.message].message || 'upload_failed');
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

    let commentsWithEnrichedAttachments = [];

    // on retourne la liste mise à jour des commentaires du site
    let comments: { [key: number]: ShantytownRawComment[] } = [];
    try {
        comments = await shantytownModel.getComments(author, [shantytown.id]);
        if (!comments[shantytown.id]) {
            throw new ServiceError('fetch_failed', new Error('Impossible de retrouver les commentaires en base de données'));
        }
        const rawComments = comments[shantytown.id];
        commentsWithEnrichedAttachments = await Promise.all(
            rawComments.map(rawComment => enrichCommentsAttachments(rawComment)),
        );
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return {
        comments: commentsWithEnrichedAttachments,
        numberOfWatchers: watchers.length,
    };
};
