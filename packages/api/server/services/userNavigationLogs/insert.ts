import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';

export default async (fk_user: number, page: string, domain: 'webapp' | 'mobile', origin?: string): Promise<number> => {
    const models = {
        mobile: userNavigationLogsModel.insertMobile,
        webapp: userNavigationLogsModel.insertWebapp,
    };

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
        logId = await models[domain](
            fk_user,
            page,
            origin || null,
        );
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne l'identifiant de la ligne insérée dans la table user_${domain}_navigation_logs
    return logId;
};
