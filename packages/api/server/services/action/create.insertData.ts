import ServiceError from '#server/errors/ServiceError';
import insertAction from '#server/models/actionModel/create/insertAction';
import { SerializedUser } from '#server/models/userModel/_common/serializeUser';
import { Transaction } from 'sequelize';
import { ActionInput } from './ActionInput';
import insertAsideData from './create.insertAsideData';

export default async (user: SerializedUser, data: ActionInput, transaction: Transaction): Promise<number> => {
    try {
        const actionId = await insertAction({
            ...data,
            address: data.location_eti,
            created_by: user.id,
        }, transaction);

        await insertAsideData(user, actionId, data, transaction);
        return actionId;
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('action_insert_error', error);
    }
};
