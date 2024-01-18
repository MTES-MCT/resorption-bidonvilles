import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import actionModel from '#server/models/actionModel';
import Action from '#root/types/resources/Action.d';
import { User } from '#root/types/resources/User.d';

const { fetch } = actionModel;

async function fetchActions(user: User, actionId: number, canAccessFinances: boolean, transaction: Transaction) {
    return fetch(
        user,
        [actionId],
        transaction,
    );
}

export default async (user: User, actionId: number, canAccessFinances: boolean, transaction: Transaction): Promise<Action> => {
    const actions = await fetchActions(user, actionId, canAccessFinances, transaction);

    if (actions.length !== 1) {
        throw new ServiceError('action_not_found', Error('Action could not be found in database'));
    }

    return actions[0];
};
