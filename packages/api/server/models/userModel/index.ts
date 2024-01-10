import autocomplete from './autocomplete';
import create from './create';
import deactivate from './deactivate';
import deleteUser from './delete';
import downgradeLocalAdmin from './downgradeLocalAdmin';
import findAll from './findAll';
import findByIds from './findByIds';
import findByOrganization from './findByOrganization';
import findByOrganizationCategory from './findByOrganizationCategory';
import findDepartementSummarySubscribers from './findDepartementSummarySubscribers';
import findForRegion from './findForRegion';
import findInactiveUsers from './findInactiveUsers';
import findOne from './findOne';
import findOneByAccessId from './findOneByAccessId';
import findOneByEmail from './findOneByEmail';
import findUsersToBeDeactivated from './findUsersToBeDeactivated';
import formatName from './_common/formatName';
import getAdminsFor from './getAdminsFor';
import getDirectory from './getDirectory';
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
import resetInactivityAlertSentAt from './resetInactivityAlertSentAt';
import setExpertiseTopics from './setExpertiseTopics';
import setInactivityAlertSentAt from './setInactivityAlertSentAt';
import setPermissionOptions from './setPermissionOptions';
import update from './update';
import upgradeLocalAdmin from './upgradeLocalAdmin';

export default {
    autocomplete,
    create,
    deactivate,
    delete: deleteUser,
    downgradeLocalAdmin,
    findAll,
    findByIds,
    findByOrganization,
    findByOrganizationCategory,
    findDepartementSummarySubscribers,
    findForRegion,
    findInactiveUsers,
    findOne,
    findOneByAccessId,
    findOneByEmail,
    findUsersToBeDeactivated,
    formatName,
    getAdminsFor,
    getDirectory,
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
