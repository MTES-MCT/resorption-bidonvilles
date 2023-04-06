import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';

export default async (): Promise<void> => {
    const users = (await userModel.findInactiveUsers());
    if (users.length === 0) {
        return;
    }

    await userModel.setInactivityAlertSentAt(users.map(({ id }) => id));
    await Promise.all(
        users.map(user => mails.sendInactiveUserAlert(user)),
    );
};
