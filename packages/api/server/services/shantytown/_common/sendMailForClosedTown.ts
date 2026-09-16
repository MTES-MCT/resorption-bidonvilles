import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import sendMailsWithConcurrencyLimit from '#server/utils/sendMailsWithConcurrencyLimit';

export default async (shantytown, updatedTown, user) => {
    const {
        departement, city, region, epci,
    } = shantytown;
    const watchers = await userModel.getLocationWatchers({
        type: 'city',
        region,
        departement,
        epci,
        city,
    }, 'shantytown_closure');
    const recipients = watchers
        .filter(({ user_id }: any) => user_id !== user.id); // do not send an email to the user who closed the town

    sendMailsWithConcurrencyLimit(recipients, watcher => mails.sendUserShantytownClosed(watcher, {
        variables: {
            departement,
            shantytown: updatedTown,
            editor: user,
        },
        preserveRecipient: false,
    }));
};
