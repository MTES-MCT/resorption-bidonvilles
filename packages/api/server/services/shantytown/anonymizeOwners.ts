import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';

export default async () => {
    try {
        await shantytownModel.anonymizeOwners();
    } catch (error) {
        throw new ServiceError('anonymization_failure', error);
    }
    return true;
};
