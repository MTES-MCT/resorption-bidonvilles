import { Transaction } from 'sequelize';

import { ActionEnrichedInput } from '#server/services/action/ActionInput.d';
import insertFinances from './insertFinances';
import insertManagers from './insertManagers';
import insertMetrics from './insertMetrics';
import insertOperators from './insertOperators';
import insertPermissions from './insertPermissions';
import insertShantytowns from './insertShantytowns';
import insertTopics from './insertTopics';

export default (actionId: number, authorId: number, date: Date, data: ActionEnrichedInput, transaction: Transaction) => {
    const promises: Promise<any>[] = [
        insertTopics(actionId, data.topics, transaction),
        insertManagers(actionId, data.managers.map(({ id }) => id), transaction),
        insertOperators(actionId, data.operators.map(({ id }) => id), transaction),
        insertMetrics(actionId, authorId, date, data, transaction),
        insertPermissions(
            actionId,
            data.managers.map(({ organization_id }) => organization_id),
            data.operators.map(({ organization_id }) => organization_id),
            transaction,
        ),
    ];

    if (data.location_shantytowns?.length > 0) {
        promises.push(insertShantytowns(actionId, data.location_shantytowns, transaction));
    }

    if (Object.keys(data.finances).length > 0) {
        promises.push(insertFinances(actionId, data.finances, transaction));
    }

    return Promise.all(promises);
};
