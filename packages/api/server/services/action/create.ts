import { sequelize } from '#db/sequelize';
import Action from '#server/models/actionModel/fetch/Action.d';
import { SerializedUser } from '#server/models/userModel/_common/serializeUser';

import { ActionInput } from './ActionInput.d';
import insertData from './create.insertData';
import fetchAction from './create.fetchAction';

export default async (user: SerializedUser, data: ActionInput): Promise<Action> => {
    const transaction = await sequelize.transaction();
    const actionId = await insertData(user, data, transaction);
    const action = await fetchAction(actionId, transaction);
    await transaction.commit();

    return action;
};
