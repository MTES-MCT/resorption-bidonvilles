import { sequelize } from '#db/sequelize';
import { ActionCreateInput } from '#server/services/action/ActionInput.d';

import insertAction from './insertAction';
import insertAsideData from './insertAsideData';

export default async (data: ActionCreateInput): Promise<number> => {
    const transaction = await sequelize.transaction();
    try {
        const actionId = await insertAction(data, transaction);
        await insertAsideData(actionId, data.created_by, data.date_indicateurs, data, transaction);

        await transaction.commit();

        return actionId;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
