import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';
import serializeReport from './_common/serializeReport';

export default async (townData, user) => {
    const reporting = await serializeReport(townData);

    // Send a notification to all national admins
    try {
        const admins = await userModel.getNationalAdmins();
        admins.forEach((admin) => {
            mails.sendAdminTownReporting(admin, {
                variables: {
                    town: reporting,
                    creator: user,
                },
                preserveRecipient: false,

            });
        });
    } catch (error) {
        throw new ServiceError('sent_failed', error);
    }
};
