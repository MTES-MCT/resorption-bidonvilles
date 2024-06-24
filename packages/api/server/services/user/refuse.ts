import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import userAccessModel from '#server/models/userAccessModel/index';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

export default async (id: number): Promise<User> => {
    const transaction = await sequelize.transaction();

    let user: User;
    try {
        user = await userModel.findOne(id, {}, null, 'refuse', transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('refresh_failure', error);
    }

    try {
        await userModel.refuse(id, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('refusal_failure', error);
    }

    try {
        await userAccessModel.create({
            fk_user: id,
            sent_by: null,
            expires_at: new Date(),
            created_at: new Date(),
            refused_at: new Date(),
        });
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('useraccesscreation_failure', error);
    }

    try {
        user = await userModel.findOne(id, {}, null, 'refused', transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('refresh_failure', error);
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('transaction_failure', error);
    }
    return user;
};
