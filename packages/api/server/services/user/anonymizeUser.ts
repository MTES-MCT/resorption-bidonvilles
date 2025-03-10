import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import ServiceError from '#server/errors/ServiceError';

export default async () => {
    const transaction = await sequelize.transaction();
    try {
        await userModel.anonymizeUser(transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('anonymization_failure', error);
    }
    return true;
};
