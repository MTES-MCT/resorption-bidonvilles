import userFavoriteShantytownModel from '#server/models/userFavoriteShantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';

const FORBIDDEN_ROLES = new Set(['intervener', 'external_observator']);

export default async function add(user: AuthUser, shantytownId: number): Promise<void> {
    if (FORBIDDEN_ROLES.has(user.role_id)) {
        throw new ServiceError('permission_denied', new Error('Permission refusée'));
    }

    try {
        await userFavoriteShantytownModel.addFavorite(user.id, shantytownId);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw new ServiceError('write_failed', new Error('Une erreur est survenue pendant l\'écriture en base de données'));
    }
}
