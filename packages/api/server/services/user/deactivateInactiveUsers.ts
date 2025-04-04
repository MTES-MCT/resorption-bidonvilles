import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';

export default async (): Promise<void> => {
    const users = (await userModel.findUsersToBeDeactivated());
    if (users.length === 0) {
        return;
    }

    await userModel.deactivate(users.map(({ id }) => id), 'auto');
    await Promise.all(
        users.map(user => mails.sendInactiveUserDeactivationAlert(user)),
    );
};
