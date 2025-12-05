import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import fetch from './fetch';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';

const { triggerRequestActionPilot } = mattermostUtils;

const requestPilot = async (actionId: number, user: AuthUser) => {
    try {
        if (!actionId) {
            throw new Error('Aucune action spécifiée');
        }

        if (!user) {
            throw new Error('Aucun utilisateur spécifié');
        }

        if (!user.isAllowedTo('read', 'action')) {
            throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'accéder aux actions'));
        }

        const action: EnrichedAction[] = await fetch(user, [actionId]);

        if (!action[0]) {
            throw new Error('L\'action n\'a pas été trouvée');
        }

        return await triggerRequestActionPilot(action[0], user);
    } catch (error) {
        throw new ServiceError('action_pilot_request_failed', error);
    }
};

export default requestPilot;
