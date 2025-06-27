import userModel from '#server/models/userModel/index';
import mails from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';
import serializeReport, { TownInput } from './_common/serializeReport';

export default async (townData: TownInput, user: User): Promise<void> => {
    const reporting = await serializeReport(townData);

    // Send a notification to all national admins
    try {
        const admins = await userModel.getNationalAdmins();
        await Promise.all(
            admins.map(admin => mails.sendAdminTownReporting(admin, {
                variables: {
                    town: reporting,
                    creator: user,
                },
                preserveRecipient: false,

            })),
        );
    } catch (error) {
        throw new ServiceError('sent_failed', error);
    }

    try {
        await mails.sendConfirmationOfTownReporting(user);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};
