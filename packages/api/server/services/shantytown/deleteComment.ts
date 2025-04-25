import validator from 'validator';
import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import permissionUtils from '#server/utils/permission';
import dateUtils from '#server/utils/date';
import ServiceError from '#server/errors/ServiceError';
import { Location } from '#server/models/geoModel/Location.d';
import enrichCommentsAttachments from './_common/enrichCommentsAttachments';

const { fromTsToFormat: tsToString } = dateUtils;

export default async (user, shantytownId, commentId, deletionMessage) => {
    let town;
    try {
        town = await shantytownModel.findOne(user, shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const comment = town.comments.find(({ id }) => id === parseInt(commentId, 10));
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', new Error('Le commentaire à supprimer n\'a pas été retrouvé en base de données'));
    }
    let author;
    try {
        author = await userModel.findOne(comment.createdBy.id);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const location: Location = {
        type: 'city',
        region: town.region,
        departement: town.departement,
        epci: town.epci,
        city: town.city,
    };

    const isOwner = author.id === user.id;
    if (!isOwner && !permissionUtils.can(user).do('moderate', 'data').on(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas accès à ces données'));
    }

    let message;
    if (!isOwner) {
        message = validator.trim(deletionMessage || '');
        if (message === '') {
            throw new ServiceError('data_incomplete', new Error('Vous devez préciser le motif de suppression du commentaire'));
        }
    }

    try {
        await shantytownCommentModel.deleteComment(commentId);
    } catch (error) {
        throw new ServiceError('delete_failed', error);
    }

    try {
        if (!isOwner) {
            const nationalAdmins = await userModel.getNationalAdmins();
            if (author.status === 'active') {
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
            } else {
                await Promise.all(nationalAdmins.map(nationalAdmin => mails.sendUserCommentDeletion(nationalAdmin, {
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
                })));
            }
        }
    } catch (error) {
        // ignore
    }

    // on retourne la liste mise à jour des commentaires du site
    let commentsWithEnrichedAttachments = [];
    try {
        // comments = await shantytownModel.getComments(author, [shantytown.id]);
        const rawComments = town.comments.filter(({ id }) => id !== parseInt(commentId, 10));
        commentsWithEnrichedAttachments = await Promise.all(rawComments.map(async rawComment => enrichCommentsAttachments(rawComment)));
    } catch (error) {
        // ignore
    }

    return {
        comments: commentsWithEnrichedAttachments,
    };
};
