import { sequelize } from '#db/sequelize';
import { UniqueConstraintError } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import createAction from '#server/models/actionModel/create/create';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import { User } from '#root/types/resources/User.d';
import { ActionInput } from './ActionInput.d';

import fetchAction from './write.fetchAction';

export default async function create(user: User, data: ActionInput): Promise<EnrichedAction> {
    const transaction = await sequelize.transaction();

    let actionId: number;
    try {
        actionId = await createAction({
            ...data,
            created_by: user.id,
        }, transaction);
    } catch (error) {
        await transaction.rollback();

        // Détecter les doublons d'adresses ETI
        if (
            error instanceof UniqueConstraintError
            && error.parent
            && 'constraint' in error.parent
            && error.parent.constraint === 'uq__action_addresses__unique_address'
        ) {
            throw new ServiceError('duplicate_action_address', error);
        }

        throw new ServiceError('insert_action_error', error);
    }

    let action: EnrichedAction;
    try {
        action = await fetchAction(user, actionId, true, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('action_fetch_error', error);
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', error);
    }

    return action;
}
