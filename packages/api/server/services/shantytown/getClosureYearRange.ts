import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';

export default async function getClosureYearRange(): Promise<{ minYear: number; maxYear: number }> {
    try {
        return await shantytownModel.getClosureYearRange();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
}
