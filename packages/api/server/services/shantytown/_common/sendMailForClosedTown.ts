const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');

module.exports = async (shantytown, updatedTown, user) => {
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
        .filter(({ user_id }) => user_id !== user.id) // do not send an email to the user who closed the town
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
