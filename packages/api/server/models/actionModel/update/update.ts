import { Transaction } from 'sequelize';

import { ActionUpdateInput } from '#server/services/action/ActionInput.d';
import historize from '../historize/historize';
import resetAsideData from './resetAsideData';
import insertAsideData from '../create/insertAsideData';
import updateAction from './updateAction';
import updateMetrics from './updateMetrics';

export default async function updateActionModel(id: number, data: ActionUpdateInput, canWriteFinances: boolean, transaction: Transaction): Promise<void> {
    // save current state into history tables
    await historize(id, canWriteFinances, transaction);

    // empty all "aside" tables (sauf les indicateurs, versionnés : voir updateMetrics)
    await resetAsideData(id, canWriteFinances, transaction);

    // update
    await updateAction(id, data, transaction);
    await insertAsideData(id, data.updated_by, data, transaction, { skipMetrics: true });

    // les indicateurs ne sont réécrits que s'ils ont changé
    await updateMetrics(id, data.updated_by, data, transaction);
}
