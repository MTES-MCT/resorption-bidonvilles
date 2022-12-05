import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import ServiceError from '#server/errors/ServiceError';

export default async (fk_user: number, page: String, domain: 'webapp' | 'mobile'): Promise<number> => {
    // on insère le log
    let logId: number;
    try {
        logId = await userNavigationLogsModel.insert(
            fk_user,
            page,
            domain,
        );
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    // on retourne l'identifiant de la ligne insérée dans la table user_${domain}_navigation_logs
    return logId;
};
