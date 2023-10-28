import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import ServiceError from '#server/errors/ServiceError';

export default async (id: number, tags: string[]): Promise<SerializedUser> => {
    const transaction = await sequelize.transaction();

    try {
        await userModel.update(id, { tags_chosen: true }, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('user_update_failure', error);
    }

    try {
        await userModel.setTags(id, tags, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('tags_save_failure', error);
    }

    let user: SerializedUser;
    try {
        user = await userModel.findOne(id, {}, null, 'read', transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('user_search_failure', error);
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('transaction_failure', error);
    }

    return user;
};
