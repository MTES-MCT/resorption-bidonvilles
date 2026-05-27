import { Transaction } from 'sequelize';

import { ActionUpdateInput } from '#server/services/action/ActionInput.d';
import historize from '../historize/historize';
import resetAsideData from './resetAsideData';
import insertAsideData from '../create/insertAsideData';
import updateAction from './updateAction';

export default async function updateActionModel(id: number, data: ActionUpdateInput, canWriteFinances: boolean, transaction: Transaction): Promise<void> {
    // save current state into history tables
    await historize(id, canWriteFinances, transaction);

    // empty all "aside" tables
    await resetAsideData(id, canWriteFinances, transaction);

    // update
    await updateAction(id, data, transaction);
    await insertAsideData(id, data.updated_by, data, transaction);
}
