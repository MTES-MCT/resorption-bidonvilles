import anonymizationRequest from './anonymizationRequest';
import anonymizeUser from './anonymize';
import autocomplete from './autocomplete';
import create from './create';
import deactivate from './deactivate';
import deactivateExpiredUsers from './deactivateExpiredUsers';
import deleteUser from './delete';
import downgradeLocalAdmin from './downgradeLocalAdmin';
import findAll from './findAll';
import findByIds from './findByIds';
import findDepartementSummarySubscribers from './findDepartementSummarySubscribers';
import findForRegion from './findForRegion';
import findInactiveUsers from './findInactiveUsers';
import findOne from './findOne';
import findOneByAccessId from './findOneByAccessId';
import findOneByEmail from './findOneByEmail';
import findUsersToBeDeactivated from './findUsersToBeDeactivated';
import formatName from './_common/formatName';
import getAdminsFor from './getAdminsFor';
import getHistory from './getHistory';
import getLocationWatchers from './getLocationWatchers';
import getQuestionSubscribers from './getQuestionSubscribers';
import getQuestionWatchers from './getQuestionWatchers';
import getNationalAdmins from './_common/getNationalAdmins';
import getShantytownWatchers from './getShantytownWatchers';
import getActionObservers from './getActionObservers';
import isTracked from './isTracked';
import listExport from './listExport';
import reactivate from './reactivate';
import refuse from './refuse';
import resetInactivityAlertSentAt from './resetInactivityAlertSentAt';
import setExpertiseTopics from './setExpertiseTopics';
import setInactivityAlertSentAt from './setInactivityAlertSentAt';
import setPermissionOptions from './setPermissionOptions';
import update from './update';
import upgradeLocalAdmin from './upgradeLocalAdmin';

export default {
    anonymizationRequest,
    anonymizeUser,
    autocomplete,
    refuse,
    create,
    deactivate,
    deactivateExpiredUsers,
    delete: deleteUser,
    downgradeLocalAdmin,
    findAll,
    findByIds,
    findDepartementSummarySubscribers,
    findForRegion,
    findInactiveUsers,
    findOne,
    findOneByAccessId,
    findOneByEmail,
    findUsersToBeDeactivated,
    formatName,
    getAdminsFor,
    getHistory,
    getLocationWatchers,
    getQuestionSubscribers,
    getQuestionWatchers,
    getNationalAdmins,
    getShantytownWatchers,
    getActionObservers,
    isTracked,
    listExport,
    reactivate,
    resetInactivityAlertSentAt,
    setExpertiseTopics,
    setInactivityAlertSentAt,
    setPermissionOptions,
    update,
    upgradeLocalAdmin,
};
