import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';
import sendMailsWithConcurrencyLimit from '#server/utils/sendMailsWithConcurrencyLimit';

export default async (): Promise<void> => {
    const users = (await userModel.findUsersToBeDeactivated());
    if (users.length === 0) {
        return;
    }

    await userModel.deactivate(users.map(({ id }) => id), 'auto');
    await sendMailsWithConcurrencyLimit(users, user => mails.sendInactiveUserDeactivationAlert(user));
};
