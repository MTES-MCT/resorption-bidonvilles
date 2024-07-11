import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import actionModel from '#server/models/actionModel';
import { User } from '#root/types/resources/User.d';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import enrichCommentsAttachments from './enrichCommentsAttachments';

const { fetch } = actionModel;

async function fetchActions(user: User, actionId: number, canAccessFinances: boolean, transaction: Transaction) {
    return fetch(
        user,
        [actionId],
        transaction,
    );
}

export default async (user: User, actionId: number, canAccessFinances: boolean, transaction: Transaction): Promise<EnrichedAction> => {
    const actions = await fetchActions(user, actionId, canAccessFinances, transaction);

    if (actions.length !== 1) {
        throw new ServiceError('action_not_found', Error('Action could not be found in database'));
    }


    const enrichedActions: EnrichedAction[] = await Promise.all(actions.map(async (action) => {
        const { comments, ...actionWithoutComments } = action;
        const commentsWithEnrichedAttachments = await Promise.all(comments.map(async comment => enrichCommentsAttachments(comment)));
        return {
            ...actionWithoutComments,
            comments: commentsWithEnrichedAttachments,
        };
    }));
    if (actions.length !== 1) {
        throw new ServiceError('action_not_found', Error('Action could not be found in database'));
    }
    return enrichedActions[0];
};
