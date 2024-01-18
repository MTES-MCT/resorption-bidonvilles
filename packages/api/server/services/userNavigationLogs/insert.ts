import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';

export default async (fk_user: number, page: string): Promise<number> => {
    let toBeTracked: boolean;
    try {
        toBeTracked = await userModel.isTracked(fk_user);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (toBeTracked === false) {
        return null;
    }

    // on insère le log
    let logId: number;
    try {
        logId = await userNavigationLogsModel.insertWebapp(fk_user, page);
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne l'identifiant de la ligne insérée dans la table user_webapp_navigation_logs
    return logId;
};
