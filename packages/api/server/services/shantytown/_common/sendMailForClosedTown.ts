import userModelFactory from '#server/models/userModel';
import mails from '#server/mails/mails';

const userModel = userModelFactory();

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
    }, 'shantytown_closure', true);
    watchers
        .filter(({ user_id }: any) => user_id !== user.id) // do not send an email to the user who closed the town
        .forEach((watcher) => {
            mails.sendUserShantytownClosed(watcher, {
                variables: {
                    departement,
                    shantytown: updatedTown,
                    editor: user,
                },
                preserveRecipient: false,
            });
        });
};
