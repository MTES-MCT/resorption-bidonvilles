import ServiceError from '#server/errors/ServiceError';
import majicModel from '#server/models/majicModel';
import { AuthUser } from '#server/middlewares/authMiddleware';
import permissionUtils from '#server/utils/permission';
import { Departement } from '#server/models/geoModel/Location.d';

export default async (departementId: string, user: AuthUser) => {
    if (!permissionUtils.can(user).do('access', 'land_registry').on(
        { type: 'departement', departement: { code: departementId } } as Departement,
    )) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'accéder au registre foncier.'));
    }

    let majicYear: string;
    try {
        majicYear = await majicModel.getMajicYear();
    } catch (e) {
        throw new ServiceError('fetch_error', new Error('Une erreur est survenue lors de la récupération du millésime du registre foncier.'));
    }
    return majicYear;
};
