import matomoCtlr_getWeeklyActiveUsers from './matomoController/getWeeklyActiveUsers';
import shantytownCommentCtlr_create from './shantytownCommentController/create';
import shantytownCommentCtlr_export from './shantytownCommentController/export';
import userNavigationLogsCtlr_insert from './userNavigationLogsController/insert';

import configController from './configController';
import contactController from './contactController';
import contactFormReferralController from './contactFormReferralController';
import directoryController from './directoryController';
import geoController from './geoController';
import inviteController from './inviteController';
import organizationController from './organizationController';
import planController from './planController';
import poiController from './poiController';
import statsController from './statsController';
import townController from './townController';
import userActivityController from './userActivityController';
import userController from './userController';

export default models => ({
    config: configController(models),
    contact: contactController(models),
    contactFormReferral: contactFormReferralController(),
    directory: directoryController(models),
    geo: geoController(models),
    invite: inviteController(),
    matomo: {
        getWeeklyActiveUsers: matomoCtlr_getWeeklyActiveUsers,
    },
    organization: organizationController(models),
    plan: planController(models),
    poi: poiController(),
    shantytownComment: {
        create: shantytownCommentCtlr_create,
        export: shantytownCommentCtlr_export,
    },
    stats: statsController(models),
    town: townController(models),
    user: userController(models),
    userActivity: userActivityController(models),
    userNavigationLogs: {
        insert: userNavigationLogsCtlr_insert,
    },
});
