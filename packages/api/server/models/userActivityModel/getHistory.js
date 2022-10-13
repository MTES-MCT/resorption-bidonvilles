const shantytownModel = require('#server/models/shantytownModel');
const shantytownCommentModel = require('#server/models/shantytownCommentModel');
const highCovidCommentModel = require('#server/models/highCovidCommentModel');
const userModel = require('#server/models/userModel');
const planCommentModel = require('#server/models/planCommentModel');

/**
 * @param {Object} userLocation Location to be used for 'local' permissions
 * @param {HistoryPermissions} permissions See above
 * @param {Object} location Location to be queried
 * @param {Array.<String>} entities List of entities to be included
 */
module.exports = async (user, location, entities, numberOfActivities, lastDate, maxDate) => {
    console.time('==========Analyse de userActivityModel.getHistory===============');
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

    let townActivities = [];
    let commentActivities = [];
    let covidCommentActivities = [];
    let userActivities = [];
    let planCommentActivities = [];

    if (shantytownFilter.length > 0) {
        console.time('SQL-History-TOWNS');
        townActivities = await shantytownModel.getHistory(user, location, shantytownFilter, numberOfActivities, lastDate, maxDate);
        console.timeEnd('SQL-History-TOWNS');
    }

    if (entities.includes('shantytownComment')) {
        console.time('SQL-History-COMMENTS');
        commentActivities = await shantytownCommentModel.getHistory(user, location, numberOfActivities, lastDate, maxDate, entities.includes('onlyCovid'));
        console.timeEnd('SQL-History-COMMENTS');
    }
    if (entities.includes('highCovidComment')) {
        console.time('SQL-History-COVIDCOMMENTS');
        covidCommentActivities = await highCovidCommentModel.getHistory(user, location, numberOfActivities, lastDate, maxDate);
        console.timeEnd('SQL-History-COVIDCOMMENTS');
    }
    if (entities.includes('user')) {
        console.time('SQL-History-USERS');
        userActivities = await userModel.getHistory(location, numberOfActivities, lastDate, maxDate);
        console.timeEnd('SQL-History-USERS');
    }
    if (entities.includes('planComment')) {
        console.time('SQL-History-PLANCOMMENTS');
        planCommentActivities = planCommentModel.getHistory(user, location, numberOfActivities, lastDate, maxDate);
        console.timeEnd('SQL-History-PLANCOMMENTS');
    }
    console.time('Attente de la promise');
    // const promiseActivities = await Promise.all(promises);
    console.timeEnd('Attente de la promise');

    console.time('analyse de la concaténation des activités');
    const activities = [...townActivities, ...commentActivities, ...covidCommentActivities, ...userActivities, ...planCommentActivities];
    console.timeEnd('analyse de la concaténation des activités');


    const sortedActivities = activities.flat().sort((a, b) => (a.date > b.date ? -1 : 1));

    console.timeEnd('==========Analyse de userActivityModel.getHistory===============');

    if (numberOfActivities !== -1) {
        return sortedActivities.slice(0, numberOfActivities);
    }

    return sortedActivities;
};
