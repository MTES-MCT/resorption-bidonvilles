import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import actionModel from '#server/models/actionModel';
import Action from '#root/types/resources/Action.d';


const { fetch } = actionModel;

async function fetchActions(actionId: number, canAccessFinances: boolean, transaction: Transaction) {
    return fetch(
        [actionId],
        null,
        canAccessFinances ? null : {
            allowed: false,
            allow_all: false,
            is_writing: false,
            allowed_on: null,
        },
        transaction,
    );
}

export default async (actionId: number, canAccessFinances: boolean, transaction: Transaction): Promise<Action> => {
    const actions = await fetchActions(actionId, canAccessFinances, transaction);

    if (actions.length !== 1) {
        throw new ServiceError('action_not_found', Error('Action could not be found in database'));
    }

    return actions[0];
};
