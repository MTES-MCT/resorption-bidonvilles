import { sequelize } from '#db/sequelize';

import { ActionUpdateInput } from '#server/services/action/ActionInput.d';
import historize from '../historize/historize';
import resetAsideData from './resetAsideData';
import insertAsideData from '../create/insertAsideData';
import updateAction from './updateAction';

export default async (id: number, data: ActionUpdateInput): Promise<void> => {
    const transaction = await sequelize.transaction();
    try {
        // save current state into history tables
        await historize(id, transaction);

        // empty all "aside" tables
        await resetAsideData(id, transaction);

        // update
        await updateAction(id, data, transaction);
        await insertAsideData(id, data.updated_by, data.date_indicateurs, data, transaction);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};