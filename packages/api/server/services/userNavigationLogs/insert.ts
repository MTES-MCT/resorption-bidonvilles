import userNavigationLogsModel from '#server/models/userNavigationLogsModel';
import userModel from '#server/models/userModel/index';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';

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
    const transaction = await sequelize.transaction();
    try {
        logId = await userNavigationLogsModel.insertWebapp(fk_user, page, transaction);
        await userModel.update(fk_user, {
            last_access: new Date(),
            transaction
        });
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_failed', error);
    }
    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', error);
    }

    // on retourne l'identifiant de la ligne insérée dans la table user_webapp_navigation_logs
    return logId;
};
