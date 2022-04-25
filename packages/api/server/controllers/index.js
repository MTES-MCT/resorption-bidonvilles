const fs = require('fs');
const path = require('path');

const createShantytownComment = require('./shantytownCommentController/create');
const exportShantytownComment = require('./shantytownCommentController/export');
const getWeeklyActiveUsers = require('./matomoController/getWeeklyActiveUsers');
const insertUserNavigationLogs = require('./userNavigationLogsController/insert');

module.exports = (models) => {
    const basename = path.basename(module.filename);
    const controllers = {
        matomo: {
            getWeeklyActiveUsers,
        },
        shantytownComment: {
            create: createShantytownComment,
            export: exportShantytownComment,
        },
        userNavigationLogs: {
            insert: insertUserNavigationLogs,
        },
    };

    // instanciate all controllers
    fs
        .readdirSync(__dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
        .forEach((file) => {
            /* eslint-disable-next-line */
            controllers[file.replace('Controller.js', '')] = require(path.join(__dirname, file))(models);
        });

    return controllers;
};
