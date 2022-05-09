const shantytownModel = require('#server/models/shantytownModel');
const mattermostUtils = require('#server/utils/mattermost');
const sendMailForClosedTown = require('./_common/sendMailForClosedTown');

module.exports = async (user, data) => {
    // close the town
    await shantytownModel.update(
        user,
        data.shantytown.id,
        {
            closed_at: data.closed_at,
            closed_with_solutions: data.closed_with_solutions,
            status: data.status,
            closing_solutions: data.solutions,
        },
    );
    const updatedTown = await shantytownModel.findOne(user, data.shantytown.id);

    // Send a mattermost alert, if it fails, do nothing
    try {
        await mattermostUtils.triggerShantytownCloseAlert(updatedTown, user);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Error with shantytown close mattermost webhook : ${err.message}`);
    }
    // Send a notification to all users of the related departement, if it fails, do nothing
    try {
        await sendMailForClosedTown(data.shantytown, updatedTown, user);
    } catch (ignore) {
        // ignore
    }
    return updatedTown;
};
