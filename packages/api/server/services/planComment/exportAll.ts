import moment from 'moment';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';
import actionModel from '#server/models/actionModel';
import { ActionCommentRow } from '#server/models/actionModel/fetchComments/fetchComments';

export default async (user) => {
    const nationalLevel = { type: 'nation' };

    if (!permissionUtils.can(user).do('export', 'plan_comment').on(nationalLevel)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'exporter les commentaires'));
    }

    let comments: ActionCommentRow[];
    try {
        comments = await actionModel.fetchComments();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (comments.length === 0) {
        throw new ServiceError('no_data', new Error('Il n\'y a aucun commentaire à exporter'));
    }
    // build excel file
    return comments.map((row) => {
        const createdAt = moment(row.created_at).utcOffset(2);

        return {
            S: createdAt.format('w'),
            'ID du commentaire': row.id,
            'ID de l\'action': row.action_id,
            'Publié le': createdAt.format('DD/MM/YYYY'),
            Description: row.description,
            'ID de l\'auteur(e)': row.creator_id,
            'Nom de famille': row.creator_last_name,
            Structure: row.creator_organization_abbreviation || row.creator_organization_name,
            Role: row.creator_user_role,
        };
    });
};
