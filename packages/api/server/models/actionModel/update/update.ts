import { Transaction } from 'sequelize';

import { ActionUpdateInput } from '#server/services/action/ActionInput.d';
import historize from '../historize/historize';
import resetAsideData from './resetAsideData';
import insertAsideData from '../create/insertAsideData';
import updateAction from './updateAction';

export default async (id: number, data: ActionUpdateInput, transaction: Transaction): Promise<void> => {
    // save current state into history tables
    await historize(id, transaction);

    // empty all "aside" tables
    await resetAsideData(id, transaction);

    // update
    await updateAction(id, data, transaction);
    await insertAsideData(id, data.updated_by, data.date_indicateurs, data, transaction);
};
