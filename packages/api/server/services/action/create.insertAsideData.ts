import insertTopics from '#server/models/actionModel/create/insertTopics';
import insertManagers from '#server/models/actionModel/create/insertManagers';
import insertOperators from '#server/models/actionModel/create/insertOperators';
import insertMetrics from '#server/models/actionModel/create/insertMetrics';
import insertPermissions from '#server/models/actionModel/create/insertPermissions';
import insertShantytowns from '#server/models/actionModel/create/insertShantytowns';
import insertFinances from '#server/models/actionModel/create/insertFinances';
import can from '#server/utils/permission/can';
import { SerializedUser } from '#server/models/userModel/_common/serializeUser';
import { Transaction } from 'sequelize';
import { ActionInput } from './ActionInput';

function addShantytownsPromise(actionId: number, data: ActionInput, transaction: Transaction, promises: Promise<any>[]) {
    if (data.location_shantytowns?.length > 0) {
        promises.push(insertShantytowns(actionId, data.location_shantytowns, transaction));
    }
}

function addFinancesPromise(user: SerializedUser, actionId: number, data: ActionInput, transaction: Transaction, promises: Promise<any>[]) {
    const isAManager = data.managers.some(({ organization_id }) => user.organization.id === organization_id);
    if (isAManager || can(user).do('access', 'action_finances').on(data.departement)) {
        promises.push(insertFinances(actionId, data.finances, transaction));
    }
}

export default (user: SerializedUser, actionId: number, data: ActionInput, transaction: Transaction) => {
    const managerIds = data.managers.map(({ id }) => id);
    const operatorIds = data.operators.map(({ id }) => id);

    const promises: Promise<any>[] = [
        insertTopics(actionId, data.topics, transaction),
        insertManagers(actionId, managerIds, transaction),
        insertOperators(actionId, operatorIds, transaction),
        insertMetrics(actionId, user.id, data.date_indicateurs, data, transaction),
        insertPermissions(actionId, managerIds, operatorIds, transaction),
    ];

    addShantytownsPromise(actionId, data, transaction, promises);
    addFinancesPromise(user, actionId, data, transaction, promises);

    return Promise.all(promises);
};
