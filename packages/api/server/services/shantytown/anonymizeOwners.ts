import shantytownModel from '#server/models/shantytownModel';
import tchapUtils from '#server/utils/tchap';

export default async function anonymizeOwners(): Promise<{ shantytownLines: number, shantytownHistoryLines: number }> | null {
    let result = {
        shantytownLines: 0,
        shantytownHistoryLines: 0,
    };
    let anonymizationSuccessful = false;

    try {
        result = await shantytownModel.anonymizeOwners();
        anonymizationSuccessful = true;
    } catch (error) {
        await tchapUtils.triggerNotifyOwnersAnonymizationError(error.message);
    }
    if (anonymizationSuccessful) {
        await tchapUtils.triggerNotifyOwnersAnonymization(result.shantytownLines, result.shantytownHistoryLines);
        return result;
    }
    return null;
}
