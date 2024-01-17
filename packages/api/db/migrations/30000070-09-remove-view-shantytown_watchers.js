const createViewShantytownWatchers = require('./common/shantytown_watchers/01_create_view_shantytown_watchers');

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW IF EXISTS shantytown_watchers',
    ),

    down: queryInterface => createViewShantytownWatchers(queryInterface),
};
