import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';

export default async function setResorptionTarget(user, data) {
    if (!permissionUtils.can(user).do('update', 'shantytown').on(data.shantytown)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de marquer ce site comme "Objectif résorption"'));
    }

    const currentYear = new Date().getFullYear();

    try {
        await shantytownModel.setResorptionTarget(
            data.shantytown.id,
            currentYear,
        );
    } catch {
        throw new ServiceError('write_failed', new Error('Une erreur est survenue pendant l\'écriture en base de données'));
    }

    return shantytownModel.findOne(user, data.shantytown.id);
}
