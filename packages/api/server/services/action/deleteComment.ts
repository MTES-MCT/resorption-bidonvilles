import validator from 'validator';
import actionModel from '#server/models/actionModel';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import permissionUtils from '#server/utils/permission';
import dateUtils from '#server/utils/date';
import ServiceError from '#server/errors/ServiceError';
import { Location } from '#server/models/geoModel/Location.d';
import deleteComment from '#server/models/actionModel/deleteComment/deleteComment';

const { fromTsToFormat: tsToString } = dateUtils;

export default async (user, actionId, commentId, deletionMessage) => {
    let action;
    try {
        action = await actionModel.fetch(user, actionId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const comment = action[0].comments.find(({ id }) => id === parseInt(commentId, 10));

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
        region: action.region,
        departement: action.departement,
        epci: action.epci,
        city: action.city,
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
        await deleteComment(commentId);
    } catch (error) {
        throw new ServiceError('delete_failed', error);
    }

    try {
        if (!isOwner) {
            const nationalAdmins = await userModel.getNationalAdmins();
            const mailVariables = {
                town: {
                    usename: action.usename,
                    city: {
                        name: action.city.name,
                    },
                },
                comment: {
                    description: comment.description,
                    created_at: tsToString(comment.createdAt, 'd/m/Y'),
                },
                message,
            };
            if (author.status === 'active') {
                await mails.sendUserCommentDeletion(author, {
                    variables: mailVariables,
                    bcc: nationalAdmins,
                });
            } else {
                await Promise.all(nationalAdmins.map(nationalAdmin => mails.sendAdminCommentDeletion(nationalAdmin, {
                    variables: mailVariables,
                    preserveRecipient: false,
                })));
            }
        }
    } catch (error) {
        // ignore
    }

    return true;
};
