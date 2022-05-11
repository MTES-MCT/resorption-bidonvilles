const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');
const getPermission = require('#server/utils/permission/getPermission');


module.exports = async (user, data) => {
    const permission = getPermission(user, 'fix_status', 'shantytown');

    if (!permission) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de modifier le statu d\'un site fermé'));
    }

    await shantytownModel.fixClosedStatus(
        data.shantytown.id,
        data.closed_with_solutions,
    );
    const updatedTown = await shantytownModel.findOne(user, data.shantytown.id);


    return updatedTown;
};
