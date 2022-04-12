const userModel = require('#server/models/userModel');
const { sendUserShantytownClosed } = require('#server/mails/mails');

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
    }, true);
    watchers
        .filter(({ user_id }) => user_id !== user.id) // do not send an email to the user who closed the town
        .forEach((watcher) => {
            sendUserShantytownClosed(watcher, {
                variables: {
                    departement,
                    shantytown: updatedTown,
                    editor: user,
                },
                preserveRecipient: false,
            });
        });
};
