const fs = require('fs');
const path = require('path');

const createShantytownComment = require('./shantytownCommentController/create');
const exportShantytownComment = require('./shantytownCommentController/export');
const getWeeklyActiveUsers = require('./matomoController/getWeeklyActiveUsers');
const townController = require('./townController');
import insertUserNavigationLogs from './userNavigationLogsController/insert';

export default (models) => {
    const basename = path.basename(module.filename);
    const controllers = {
        matomo: {
            getWeeklyActiveUsers,
        },
        shantytownComment: {
            create: createShantytownComment,
            export: exportShantytownComment,
        },
        town: townController,
        userNavigationLogs: {
            insert: insertUserNavigationLogs,
        },
    };

    // instanciate all controllers
    return fs
        .readdirSync(__dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
        .reduce((acc, file) => {
            return {
                ...acc,
                /* eslint-disable-next-line */
                [file.replace('Controller.js', '')]: require(path.join(__dirname, file))(models)
            };
        }, controllers);
};
