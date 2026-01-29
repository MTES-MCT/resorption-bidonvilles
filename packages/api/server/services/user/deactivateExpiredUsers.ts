import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import ServiceError from '#server/errors/ServiceError';

const deactivateExpiredUsers = async (): Promise<number[]> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await userModel.deactivateExpiredUsers(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('deactivation_failure', error);
    }
};

export default deactivateExpiredUsers;
