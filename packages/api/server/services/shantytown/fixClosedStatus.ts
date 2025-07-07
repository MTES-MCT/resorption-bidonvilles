import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';

export default async (user, data) => {
    if (!permissionUtils.can(user).do('fix_status', 'shantytown').on(data.shantytown)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de modifier le statut d\'un site fermé'));
    }
    shantytownModel.fixClosedStatus(
        data.shantytown.id,
        data.closed_with_solutions,
    );

    return shantytownModel.findOne(user, data.shantytown.id);
};
