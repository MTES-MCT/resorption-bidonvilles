import { sequelize } from '#db/sequelize';
import { ActionInsertionRow } from './ActionInsertionRow.d';

import insertAction from './insertAction';
import insertAsideData from './insertAsideData';

export default async (data: ActionInsertionRow): Promise<number> => {
    const transaction = await sequelize.transaction();
    try {
        const actionId = await insertAction(data, transaction);
        await insertAsideData(actionId, data.created_by, new Date(), data, transaction);

        await transaction.commit();

        return actionId;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
