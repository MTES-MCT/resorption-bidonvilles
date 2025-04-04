import shantytownModel from '#server/models/shantytownModel';
import mattermostUtils from '#server/utils/mattermost';

export default async (): Promise<{ shantytownLines: number, shantytownHistoryLines: number }> | null => {
    let result = {
        shantytownLines: 0,
        shantytownHistoryLines: 0,
    };
    let anonymizationSuccessful = false;

    try {
        result = await shantytownModel.anonymizeOwners();
        anonymizationSuccessful = true;
    } catch (error) {
        await mattermostUtils.triggerNotifyOwnersAnonymizationError(error.message);
    }
    if (anonymizationSuccessful) {
        await mattermostUtils.triggerNotifyOwnersAnonymization(result.shantytownLines, result.shantytownHistoryLines);
        return result;
    }
    return null;
};
