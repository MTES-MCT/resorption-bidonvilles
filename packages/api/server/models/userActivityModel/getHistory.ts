import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import actionModel from '#server/models/actionModel';

/**
 * @param {Object} userLocation Location to be used for 'local' permissions
 * @param {HistoryPermissions} permissions See above
 * @param {Object} location Location to be queried
 * @param {Array.<String>} activityTypeFilter List of activityTypeFilter to be included
 */
export default async (user, location, activityTypeFilter, resorbedFilter, myTownsFilter, numberOfActivities, lastDate, maxDate) => {
    const promises = [];
    const shantytownFilter = [];

    if (activityTypeFilter.includes('shantytownCreation')) {
        shantytownFilter.push('shantytownCreation');
    }
    if (activityTypeFilter.includes('shantytownUpdate')) {
        shantytownFilter.push('shantytownUpdate');
    }
    if (activityTypeFilter.includes('shantytownClosing')) {
        shantytownFilter.push('shantytownClosing');
    }
    if (shantytownFilter.length > 0) {
        promises.push(shantytownModel.getHistory(user, location, shantytownFilter, resorbedFilter, myTownsFilter, numberOfActivities, lastDate, maxDate));
    }
    if (activityTypeFilter.includes('shantytownComment')) {
        promises.push(shantytownCommentModel.getHistory(user, location, numberOfActivities, lastDate, maxDate));
    }
    if (activityTypeFilter.includes('user')) {
        promises.push(userModel.getHistory(location, numberOfActivities, lastDate, maxDate));
    }
    if (activityTypeFilter.includes('actionComment')) {
        promises.push(actionModel.getCommentHistory(user, location, numberOfActivities, lastDate, maxDate));
    }
    const activities = await Promise.all(promises);
    const sortedActivities = activities.flat().sort((a, b) => (a.date > b.date ? -1 : 1));

    if (numberOfActivities !== -1) {
        return sortedActivities.slice(0, numberOfActivities);
    }

    return sortedActivities;
};
