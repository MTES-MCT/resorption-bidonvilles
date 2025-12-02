import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';

const { triggerRequestActionPilot } = mattermostUtils;

export default async (action: EnrichedAction, user: AuthUser) => {
    try {
        if (!action) {
            throw new Error('Aucune action spécifiée');
        }

        if (!user) {
            throw new Error('Aucun utilisateur spécifié');
        }

        if (!user.isAllowedTo('read', 'action')) {
            throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'accéder aux actions'));
        }

        return await triggerRequestActionPilot(action, user);
    } catch (error) {
        throw new ServiceError('action_pilot_request_failed', error);
    }
};
