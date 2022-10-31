import moment from 'moment';
import planCommentModelFactory from '#server/models/planCommentModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';

const planCommentModel = planCommentModelFactory();

export default async (user) => {
    const nationalLevel = { type: 'nation' };

    if (!permissionUtils.can(user).do('export', 'plan_comment').on(nationalLevel)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'exporter les commentaires'));
    }


    let comments;
    try {
        comments = await planCommentModel.findAll();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (comments.length === 0) {
        throw new ServiceError('no_data', new Error('Il n\'y a aucun commentaire à exporter'));
    }
    // build excel file
    return comments.map((row) => {
        const createdAt = moment(row.commentCreatedAt).utcOffset(2);

        return {
            S: createdAt.format('w'),
            'ID du commentaire': row.id,
            'ID de l\'action': row.plan,
            'Publié le': createdAt.format('DD/MM/YYYY'),
            Description: row.description,
            'ID de l\'auteur(e)': row.createdBy.id,
            'Nom de famille': row.createdBy.last_name,
            Structure: row.createdBy.organization,
            Role: row.createdBy.role,
        };
    });
};
