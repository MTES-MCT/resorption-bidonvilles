import { sequelize } from '#db/sequelize';
import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';
import userDeactivationModel from '#server/models/userDeactivationModel';

export default async (): Promise<void> => {
    const users = (await userModel.findUsersToBeDeactivated());
    if (users.length === 0) {
        return;
    }
    const transaction = await sequelize.transaction();

    try {
        await Promise.all(
            [...users.map(user => userDeactivationModel.add(user.id, transaction)),
                userModel.deactivate(users.map(({ id }) => id), transaction),
            ],
        );
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }


    await Promise.all(
        users.map(user => mails.sendInactiveUserDeactivationAlert(user)),
    );
};
