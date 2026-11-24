import { Transaction } from 'sequelize';

import { ActionEnrichedInput } from '#server/services/action/ActionInput.d';
import insertAddresses from './insertAddresses';
import insertFinances from './insertFinances';
import insertManagers from './insertManagers';
import insertMetrics from './insertMetrics';
import insertOperators from './insertOperators';
import insertShantytowns from './insertShantytowns';
import insertTopics from './insertTopics';

export default function insertAsideData(actionId: number, authorId: number, data: ActionEnrichedInput, transaction: Transaction, options: { skipMetrics?: boolean } = {}) {
    const promises: Promise<any>[] = [
        insertTopics(actionId, data.topics, transaction),
        insertManagers(actionId, data.managers.map(({ id }) => id), transaction),
        insertOperators(actionId, data.operators.map(({ id, is_principal }) => ({ id, is_principal })), transaction),
        insertAddresses(actionId, data, transaction),
    ];

    // les indicateurs peuvent être gérés à part (mise à jour d'action : voir update/updateMetrics)
    if (!options.skipMetrics) {
        promises.push(insertMetrics(actionId, authorId, data, transaction));
    }

    if (data.location_shantytowns?.length > 0) {
        promises.push(insertShantytowns(actionId, data.location_shantytowns, transaction));
    }

    if (Object.keys(data.finances).length > 0) {
        promises.push(insertFinances(actionId, data.finances, transaction));
    }

    return Promise.all(promises);
}
