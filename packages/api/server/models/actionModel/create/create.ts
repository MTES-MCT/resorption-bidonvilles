import { ActionCreateInput } from '#server/services/action/ActionInput.d';
import { Transaction } from 'sequelize';

import insertAction from './insertAction';
import insertAsideData from './insertAsideData';

export default async (data: ActionCreateInput, transaction: Transaction): Promise<number> => {
    const actionId = await insertAction(data, transaction);
    await insertAsideData(actionId, data.created_by, data, transaction);

    return actionId;
};
