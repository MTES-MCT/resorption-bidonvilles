import { sequelize } from '#db/sequelize';
import { UniqueConstraintError } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import update from '#server/models/actionModel/update/update';
import can from '#server/utils/permission/can';
import Action from '#root/types/resources/Action.d';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import { User } from '#root/types/resources/User.d';
import fetchAction from './write.fetchAction';
import { ActionInput } from './ActionInput.d';

export default async function updateAction(action: Action, author: User, data: ActionInput): Promise<EnrichedAction> {
    const canWriteFinances = can(author).do('access', 'action_finances').on(action);

    const transaction = await sequelize.transaction();
    try {
        await update(action.id, {
            ...data,
            updated_by: author.id,
        }, canWriteFinances, transaction);
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

        throw new ServiceError('action_insert_error', error);
    }

    try {
        const updatedAction = await fetchAction(author, action.id, canWriteFinances, transaction);
        await transaction.commit();

        return updatedAction;
    } catch (error) {
        await transaction.rollback();

        if (error instanceof ServiceError) {
            throw error;
        }

        throw new ServiceError('action_fetch_error', error);
    }
}
