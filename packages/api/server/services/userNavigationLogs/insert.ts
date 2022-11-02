import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import ServiceError from '#server/errors/ServiceError';

export default async (fk_user: number, page: String): Promise<number> => {
    // on insère le log
    let logId: number;
    try {
        logId = await userNavigationLogsModel.insert(
            fk_user,
            page,
        );
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne l'identifiant de la ligne insérée dans la table user_navigation_logs
    return logId;
};
