import shantytownModel from '#server/models/shantytownModel';
import mattermostUtils from '#server/utils/mattermost';
import sendMailForClosedTown from './_common/sendMailForClosedTown';

export default async (user, data) => {
    // close the town
    await shantytownModel.update(
        user,
        data.shantytown.id,
        {
            closed_at: data.closed_at,
            closed_with_solutions: data.closed_with_solutions,
            status: data.status,
            closing_context: data.closing_context,
            closing_solutions: data.solutions,
            updated_at: new Date(),
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
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
    return updatedTown;
};
