import { Transaction } from 'sequelize';

import { ActionEnrichedInput } from '#server/services/action/ActionInput.d';
import insertTopics from './insertTopics';
import insertManagers from './insertManagers';
import insertOperators from './insertOperators';
import insertMetrics from './insertMetrics';
import insertShantytowns from './insertShantytowns';
import insertPermissions from './insertPermissions';

export default (actionId: number, authorId: number, date: Date, data: ActionEnrichedInput, transaction: Transaction) => {
    const promises = [
        insertTopics(actionId, data.topics, transaction),
        insertManagers(actionId, data.managers, transaction),
        insertOperators(actionId, data.operators, transaction),
        insertMetrics(authorId, actionId, date, data, transaction),
        insertPermissions(actionId, [...data.managers, ...data.operators], transaction),
    ];

    if (data.location_shantytowns?.length > 0) {
        promises.push(insertShantytowns(actionId, data.location_shantytowns, transaction));
    }

    return Promise.all(promises);
};
