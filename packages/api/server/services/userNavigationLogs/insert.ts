import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
const ServiceError = require('#server/errors/ServiceError');


/**
 * @param fk_user Identifiant de l'utilisateur connecté 
 * @param page Page consultée
 *
 * @returns identifiant de la ligne insérée dans la table user_navigation_logs
 */
export default async (fk_user: number, page: String): Promise<number> => {
    // on insère le log
    let logId: number;
    try {
        logId = await userNavigationLogsModel.insert({
            fk_user,
            page,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne l'identifiant de la ligne insérée dans la table user_navigation_logs
    return logId;
};
