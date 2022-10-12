const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');


module.exports = async (user, data) => {
    try {
        await shantytownModel.setHeatwaveStatus(
            data.shantytown.id,
            data.heatwave_status,
        );
    } catch (error) {
        throw new ServiceError('write_failed', new Error('Une erreur est survenue pendant l\'écriture en base de données'));
    }


    return shantytownModel.findOne(user, data.shantytown.id);
};
