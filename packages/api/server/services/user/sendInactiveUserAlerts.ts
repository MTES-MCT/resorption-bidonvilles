import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';
import sendMailsWithConcurrencyLimit from '#server/utils/sendMailsWithConcurrencyLimit';

export default async (): Promise<void> => {
    const users = (await userModel.findInactiveUsers());
    if (users.length === 0) {
        return;
    }

    await userModel.setInactivityAlertSentAt(users.map(({ id }) => id));
    await sendMailsWithConcurrencyLimit(users, user => mails.sendInactiveUserAlert(user));
};
