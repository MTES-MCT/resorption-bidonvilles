const validator = require('validator');
const shantytownModel = require('#server/models/shantytownModel');
const shantytownCommentModel = require('#server/models/shantytownCommentModel');
const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');
const permissionUtils = require('#server/utils/permission');
const { fromTsToFormat: tsToString } = require('#server/utils/date');
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (user, shantytownId, commentId, deletionMessage) => {
    let town;
    try {
        town = await shantytownModel.findOne(user, shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', {
            developer_message: 'Failed to retrieve the comment',
            user_message: 'Impossible de retrouver le site en base de données',
        });
    }
    const comment = town.comments.regular.find(({ id }) => id === parseInt(commentId, 10));
    if (comment === undefined) {
        throw new ServiceError('fetch_failed', {
            developer_message: 'The comment to be deleted does not exist',
            user_message: 'Le commentaire à supprimer n\'a pas été retrouvé en base de données',
        });
    }
    let author;
    try {
        author = await userModel.findOne(comment.createdBy.id);
    } catch (error) {
        throw new ServiceError('fetch_failed', {
            developer_message: 'Failed to retrieve the author of the comment',
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
    }
    const location = {
        type: 'city',
        region: town.region,
        departement: town.departement,
        epci: town.epci,
        city: town.city,
    };

    if (author.id !== user.id && !permissionUtils.can(user).do('moderate', 'shantytown_comment').on(location)) {
        throw new ServiceError('permission_denied', {
            user_message: 'Vous n\'avez pas accès à ces données',
            developer_message: 'Tried to access a secured page without authentication',
        });
    }
    const message = validator.trim(deletionMessage || '');
    if (message === '') {
        throw new ServiceError('data_incomplete', {
            user_message: 'Vous devez préciser le motif de suppression du commentaire',
            developer_message: 'Message is missing',
        });
    }

    try {
        await shantytownCommentModel.deleteComment(commentId);
    } catch (error) {
        throw new ServiceError('delete_failed',
            {
                developer_message: 'Failed to delete the comment',
                user_message: 'Impossible de supprimer le commentaire',
            });
    }

    try {
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
        });
    } catch (error) {
        // ignore
    }
    return ({
        comments: town.comments.regular.filter(({ id }) => id !== parseInt(commentId, 10)),
    });
};
