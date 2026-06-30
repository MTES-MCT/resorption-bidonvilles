import userFavoriteShantytownModel from '#server/models/userFavoriteShantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';

const FORBIDDEN_ROLES = new Set(['intervener', 'external_observator']);

export default async function fetch(user: AuthUser): Promise<number[]> {
    if (FORBIDDEN_ROLES.has(user.role_id)) {
        throw new ServiceError('permission_denied', new Error('Permission refusée'));
    }

    try {
        return await userFavoriteShantytownModel.findByUser(user.id);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw new ServiceError('fetch_failed', new Error('Une erreur est survenue pendant la récupération des favoris'));
    }
}
