const shantytownModel = require('#server/models/shantytownModel');
const shantytownCommentModel = require('#server/models/shantytownCommentModel')();
const highCovidCommentModel = require('#server/models/highCovidCommentModel')();
const userModel = require('#server/models/userModel');

/**
 * @param {Object} userLocation Location to be used for 'local' permissions
 * @param {HistoryPermissions} permissions See above
 * @param {Object} location Location to be queried
 * @param {Array.<String>} entities List of entities to be included
 */
module.exports = async (user, location, entities, numberOfActivities, lastDate, maxDate) => {
    const promises = [];
    const shantytownFilter = [];
    if (entities.includes('shantytownCreation')) {
        shantytownFilter.push('shantytownCreation');
    }
    if (entities.includes('shantytownUpdate')) {
        shantytownFilter.push('shantytownUpdate');
    }
    if (entities.includes('shantytownClosing')) {
        shantytownFilter.push('shantytownClosing');
    }
    if (shantytownFilter.length > 0) {
        promises.push(shantytownModel.getHistory(user, location, shantytownFilter, numberOfActivities, lastDate, maxDate));
    }
    if (entities.includes('shantytownComment')) {
        promises.push(shantytownCommentModel.getHistory(user, location, numberOfActivities, lastDate, maxDate, entities.includes('onlyCovid')));
    }
    if (entities.includes('highCovidComment')) {
        promises.push(highCovidCommentModel.getHistory(user, location, numberOfActivities, lastDate, maxDate));
    }
    if (entities.includes('user')) {
        promises.push(userModel.getHistory(location, numberOfActivities, lastDate, maxDate));
    }
    const activities = await Promise.all(promises);
    const sortedActivities = activities.flat().sort((a, b) => (a.date > b.date ? -1 : 1));

    if (numberOfActivities !== -1) {
        return sortedActivities.slice(0, numberOfActivities);
    }

    return sortedActivities;
};
