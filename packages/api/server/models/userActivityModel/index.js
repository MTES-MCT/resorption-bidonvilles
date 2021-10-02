const { sequelize } = require('#db/models');
const shantytownModel = require('#server/models/shantytownModel')(sequelize);
const shantytownCommentModel = require('#server/models/shantytownComment');
const highCovidCommentModel = require('#server/models/highCovidCommentModel')(sequelize);
const userModel = require('#server/models/userModel')(sequelize);

function serializeActivity(activity) {
    return activity;
}

module.exports = () => ({

    /**
     * @param {Object} userLocation Location to be used for 'local' permissions
     * @param {HistoryPermissions} permissions See above
     * @param {Object} location Location to be queried
     * @param {Array.<String>} entities List of entities to be included
     */
    async getHistory(userLocation, permissions, location, entities = ['shantytown', 'shantytownComment', 'highCovidComment', 'user']) {
        // perform query
        const promises = [];
        if (entities.includes('shantytown')) {
            promises.push(shantytownModel.getHistory(userLocation, permissions, location));
        }
        if (entities.includes('shantytownComment')) {
            promises.push(shantytownCommentModel.getHistory(userLocation, permissions, location));
        }
        if (entities.includes('highCovidComment')) {
            promises.push(highCovidCommentModel.getHistory(userLocation, permissions, location));
        }
        if (entities.includes('user')) {
            promises.push(userModel.getHistory());
        }

        const activities = await Promise.all(promises);

        const orderedActivities = [];
        while (activities.reduce((sum, { length }) => sum + length, 0) > 0) {
            // on recherche le tableau d'activités qui contient l'activité la plus récente
            // (cela part du principe que chaque tableau est préalablement ordonné de l'activité
            // la plus récente à la plus ancienne)
            const arr = activities.reduce((acc, subActivities) => {
                if (subActivities.length === 0) {
                    return acc;
                }

                if (!acc || subActivities[0].date > acc[0].date) {
                    return subActivities;
                }

                return acc;
            }, null);

            // on retire l'activité du tableau (réduisant ainsi petit à petit la taille de chaque
            // tableau : une fois chaque tableau vide, la boucle est terminée)
            const [activity] = arr.splice(0, 1);
            orderedActivities.push(serializeActivity(activity));
        }

        return orderedActivities;
    },

});
