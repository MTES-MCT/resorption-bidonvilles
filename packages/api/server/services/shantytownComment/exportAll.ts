import moment from 'moment';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';
import { Nation } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';

const { restrict } = permissionUtils;
type ShantytownCommentExport = {
    S: string,
    'ID du commentaire': number,
    'ID du site': number,
    'Publié le': string,
    Description: string,
    'ID de l\'auteur(e)': number,
    'Commentaire privé ?': 'Oui' | 'Non',
    Prénom: string,
    'Nom de famille': string,
    Structure: string,
    Département: string,
    Role: string,
    'Objectif de résorption': number,
    Tags: string,
};

export default async (user: User): Promise<ShantytownCommentExport[]> => {
    const nationalLevel: Nation = {
        type: 'nation',
        region: null,
        departement: null,
        epci: null,
        city: null,
    };
    const locations = {
        export: restrict(nationalLevel).for(user).askingTo('export', 'shantytown_comment'),
        comments: restrict(nationalLevel).for(user).askingTo('listPrivate', 'shantytown_comment'),
    };

    if (locations.export.length === 0) {
        return [];
    }

    let comments: Awaited<ReturnType<typeof shantytownCommentModel.findAll>>;
    try {
        comments = await shantytownCommentModel.findAll(user, locations.export, locations.comments);
    } catch (error) {
        throw new ServiceError('select_failed', error);
    }

    // build excel file
    return comments.map((raw): ShantytownCommentExport => {
        const createdAt = moment(raw.commentCreatedAt);

        // Replaces the problematic sharps characters in the csv file
        const stringToReplace = /#/gi;
        // eslint-disable-next-line no-param-reassign
        raw.commentDescription = raw.commentDescription.replace(stringToReplace, '♯');

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
            Tags: raw.tags && raw.tags.length > 0 ? raw.tags.join(', ') : 'Ø',
        };
    });
};
