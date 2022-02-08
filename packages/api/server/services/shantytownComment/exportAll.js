const moment = require('moment');
const shantytownCommentModel = require('#server/models/shantytownCommentModel')();
const ServiceError = require('#server/errors/ServiceError');
const { restrict } = require('#server/utils/permission');

module.exports = async (user) => {
    const nationalLevel = { type: 'nation' };
    const locations = {
        export: restrict(nationalLevel).for(user).askingTo('export', 'shantytown_comment'),
        comments: restrict(nationalLevel).for(user).askingTo('listPrivate', 'shantytown_comment'),
    };

    if (locations.export === null) {
        return [];
    }

    let comments;
    try {
        comments = await shantytownCommentModel.findAll(locations.export, locations.comments);
    } catch (error) {
        throw new ServiceError('select_failed', error);
    }

    // build excel file
    return comments.map((raw) => {
        const createdAt = moment(raw.commentCreatedAt).utcOffset(2);

        return {
            S: createdAt.format('w'),
            'ID du commentaire': raw.commentId,
            'ID du site': raw.shantytownId,
            'Publié le': createdAt.format('DD/MM/YYYY'),
            Description: raw.commentDescription,
            'ID de l\'auteur(e)': raw.userId,
            'Commentaire privé ?': raw.commentPrivate ? 'Oui' : 'Non',
            Prénom: raw.userFirstName,
            'Nom de famille': raw.userLastName,
            Structure: raw.organizationName,
            Département: raw.departementName,
            Role: raw.userRole,
            'Objectif de résorption': raw.shantytownResorptionTarget,
        };
    });
};
