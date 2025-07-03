import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';

export default async (user, data) => {
    try {
        await shantytownModel.setHeatwaveStatus(
            data.shantytown.id,
            data.heatwave_status,
        );
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        throw new ServiceError('write_failed', new Error('Une erreur est survenue pendant l\'écriture en base de données'));
    }


    return shantytownModel.findOne(user, data.shantytown.id);
};
