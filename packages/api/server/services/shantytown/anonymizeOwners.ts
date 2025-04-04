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
        try {
            await mattermostUtils.triggerNotifyOwnersAnonymizationError(error.message);
        } catch (mattermostNotificationKoErr) {
            throw mattermostNotificationKoErr;
        }
    }
    if (anonymizationSuccessful) {
        try {
            await mattermostUtils.triggerNotifyOwnersAnonymization(result.shantytownLines, result.shantytownHistoryLines);
        } catch (mattermostNotificationOkErr) {
            throw mattermostNotificationOkErr;
        }

        return result;
    }
    return null;
};
