import validator from 'validator';
import attachmentModel from '#server/models/attachmentModel';
import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import attachmentService from '#server/services/attachment';
import mails from '#server/mails/mails';
import permissionUtils from '#server/utils/permission';
import dateUtils from '#server/utils/date';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';

const { fromTsToFormat: tsToString } = dateUtils;

export default async (user, shantytownId, commentId, deletionMessage) => {
    let town;
    let transaction;
    try {
        town = await shantytownModel.findOne(user, shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const comment = [
        ...town.comments.regular,
        ...town.comments.covid,
    ].find(({ id }) => id === parseInt(commentId, 10));
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', new Error('Le commentaire à supprimer n\'a pas été retrouvé en base de données'));
    }
    let author;
    try {
        author = await userModel.findOne(comment.createdBy.id);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const location = {
        type: 'city',
        region: town.region,
        departement: town.departement,
        epci: town.epci,
        city: town.city,
    };

    const isOwner = author.id === user.id;
    if (!isOwner && !permissionUtils.can(user).do('moderate', 'shantytown_comment').on(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas accès à ces données'));
    }

    let message;
    if (!isOwner) {
        message = validator.trim(deletionMessage || '');
        if (message === '') {
            throw new ServiceError('data_incomplete', new Error('Vous devez préciser le motif de suppression du commentaire'));
        }
    }

    let promises;
    try {
        transaction = await sequelize.transaction();
        promises = comment.attachments.map(async (attachment) => {
            const keys = await attachmentModel.findKeys(attachment.id);
            return attachmentService.deleteAttachment(keys, transaction);
        });
        await Promise.all(promises);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('delete_failed', error);
    }

    try {
        await shantytownCommentModel.deleteComment(commentId, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('delete_failed', error);
    }

    // on finalise
    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', error);
    }

    try {
        if (!isOwner) {
            const nationalAdmins = await userModel.getNationalAdmins();
            await mails.sendUserCommentDeletion(author, {
                variables: {
                    town: {
                        usename: town.usename,
                        city: {
                            name: town.city.name,
                        },
                    },
                    comment: {
                        description: comment.description,
                        created_at: tsToString(comment.createdAt, 'd/m/Y'),
                    },
                    message,
                },
                bcc: nationalAdmins,
            });
        }
    } catch (error) {
        // ignore
    }

    return {
        comments: {
            regular: town.comments.regular.filter(({ id }) => id !== parseInt(commentId, 10)),
            covid: town.comments.covid.filter(({ id }) => id !== parseInt(commentId, 10)),
        },
    };
};
