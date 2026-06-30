import userFavoriteShantytownModel from '#server/models/userFavoriteShantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';

const FORBIDDEN_ROLES = new Set(['intervener', 'external_observator']);

export default async function remove(user: AuthUser, shantytownId: number): Promise<void> {
    if (FORBIDDEN_ROLES.has(user.role_id)) {
        throw new ServiceError('permission_denied', new Error('Permission refusée'));
    }

    try {
        await userFavoriteShantytownModel.removeFavorite(user.id, shantytownId);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw new ServiceError('delete_failed', new Error('Une erreur est survenue pendant la suppression en base de données'));
    }
}
