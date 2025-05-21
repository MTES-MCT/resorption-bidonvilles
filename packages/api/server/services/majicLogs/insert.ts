import majicLogsModel from '#server/models/majicLogsModel';
import ServiceError from '#server/errors/ServiceError';

export default async (fk_user: number, fk_organization: number, fk_parcel: string): Promise<number> => {
    let landRegistryRequestId: number;

    try {
        landRegistryRequestId = await majicLogsModel.insert(fk_user, fk_organization, fk_parcel);
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }
    return landRegistryRequestId;
};
