import moment from 'moment';
import JSONToCSV from 'json2csv';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';
import actionModel from '#server/models/actionModel';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Nation } from '#server/models/geoModel/Location.d';
import { ActionRowComment } from '#server/models/actionModel/fetchComments/ActionCommentRow.d';

export default async (user: AuthUser): Promise<string> => {
    const nationalLevel: Nation = {
        type: 'nation', region: null, departement: null, epci: null, city: null,
    };

    if (!permissionUtils.can(user).do('export', 'action_comment').on(nationalLevel)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'exporter les commentaires'));
    }

    let comments: ActionRowComment[];
    try {
        comments = await actionModel.fetchComments();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (comments.length === 0) {
        throw new ServiceError('no_data', new Error('Il n\'y a aucun commentaire à exporter'));
    }

    // build excel file
    return JSONToCSV.parse(
        comments.map((row) => {
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
        }),
    );
};
