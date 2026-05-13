import { sequelize } from '#db/sequelize';
import { UniqueConstraintError } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import update from '#server/models/actionModel/update/update';
import can from '#server/utils/permission/can';
import Action, { ActionOrganization } from '#root/types/resources/Action.d';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import { User } from '#root/types/resources/User.d';
import fetchAction from './write.fetchAction';
import { ActionInput } from './ActionInput.d';
import validateAndNormalizeOperators from './operatorValidation';

function detectsPrincipalChange(
    bdd: Array<ActionOrganization>,
    payload: Array<{ id: number, is_principal?: boolean }>,
): boolean {
    const bddPrincipalByUserId = new Map<number, boolean>();
    bdd.forEach((org) => {
        org.users.forEach((u) => {
            bddPrincipalByUserId.set(u.id, u.is_principal === true);
        });
    });

    return payload.some((p) => {
        if (!bddPrincipalByUserId.has(p.id)) {
            return false;
        }
        const bddValue = bddPrincipalByUserId.get(p.id) === true;
        const payloadValue = p.is_principal === true;
        return bddValue !== payloadValue;
    });
}

function isAllowedToChangePrincipal(
    author: User,
    action: Action,
): boolean {
    if (author.role_id === 'national_admin') {
        return true;
    }
    return action.managers.some(
        org => org.users.some(u => u.id === author.id),
    );
}

export default async function updateAction(action: Action, author: User, data: ActionInput): Promise<EnrichedAction> {
    const canWriteFinances = can(author).do('access', 'action_finances').on(action);

    if (detectsPrincipalChange(action.operators, data.operators) && !isAllowedToChangePrincipal(author, action)) {
        throw new ServiceError(
            'forbidden_principal_change',
            new Error('Seuls les pilotes de l\'action et les administrateurs nationaux peuvent désigner l\'opérateur principal'),
        );
    }

    validateAndNormalizeOperators(data.operators);

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
