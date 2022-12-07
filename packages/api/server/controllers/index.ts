// config
import configList from './configController/list';
// contact
import contactContact from './contactController/contact';
// contact form
import contactFormReferralExport from './contactFormReferralController/export';
// directory
import directoryList from './directoryController/list';
// geo
import geoGet from './geoController/get';
import geoGetDepartementsForEpci from './geoController/getDepartementsForEpci';
import geoGetDepartementsForRegion from './geoController/getDepartementsForRegion';
import geoListDepartements from './geoController/listDepartements';
import geoSearch from './geoController/search';
import geoSearchCities from './geoController/searchCities';
import geoSearchEpci from './geoController/searchEpci';
// invite
import inviteInvite from './inviteController/invite';
// note
import noteAddPublication from './noteController/addPublication';
import noteCreate from './noteController/create';
import noteAddCopy from './noteController/addCopy';
// organization
import organizationCategories from './organizationController/categories';
import organizationGetByCategory from './organizationController/getByCategory';
import organizationGetByType from './organizationController/getByType';
import organizationGetMembers from './organizationController/getMembers';
import organizationSearch from './organizationController/search';
import organizationTypes from './organizationController/types';
import organizationUpdateBeingFunded from './organizationController/updateBeingFunded';
// plan
import planAddState from './planController/addState';
import planClose from './planController/close';
import planCreate from './planController/create';
import planDelete from './planController/delete';
import planFind from './planController/find';
import planList from './planController/list';
import planListExport from './planController/listExport';
import planUpdate from './planController/update';
// plan comments
import createPlanComment from './planCommentController/create';
import exportComments from './planCommentController/export';
// poi
import poiFindAll from './poiController/findAll';
// shantytown
import townController from './townController';
// shantytown comments
import createShantytownComment from './shantytownCommentController/create';
import exportShantytownComment from './shantytownCommentController/export';
// stats
import statsAll from './statsController/all';
import statsDirectoryView from './statsController/directoryView';
import statsExport from './statsController/export';
import statsGetDashboardStats from './statsController/getDashboardStats';
import statsPublic from './statsController/public';
// user
import userAcceptCharte from './userController/acceptCharte';
import userActivate from './userController/activate';
import userCheckActivationToken from './userController/checkActivationToken';
import userCheckPasswordToken from './userController/checkPasswordToken';
import userCreate from './userController/create';
import userDenyAccess from './userController/denyAccess';
import userEdit from './userController/edit';
import userGet from './userController/get';
import userGetLatestActivationLink from './userController/getLatestActivationLink';
import userList from './userController/list';
import userListExport from './userController/listExport';
import userMe from './userController/me';
import userRemove from './userController/remove';
import userRenewToken from './userController/renewToken';
import userRequestNewPassword from './userController/requestNewPassword';
import userSendActivationLink from './userController/sendActivationLink';
import userSetAdminComments from './userController/setAdminComments';
import userSetDefaultExport from './userController/setDefaultExport';
import userSetLastChangelog from './userController/setLastChangelog';
import userSetNewPassword from './userController/setNewPassword';
import userSetRoleRegular from './userController/setRoleRegular';
import userSignin from './userController/signin';
import userUpdateLocalAdmin from './userController/updateLocalAdmin';
import userUpgrade from './userController/upgrade';
// user activity
import userActivityRegular from './userActivityController/regular';
// user navigation logs
import insertUserNavigationLogs from './userNavigationLogsController/insert';
import exportMobileUserNavigationLogs from './userNavigationLogsController/exportMobileSessions';
import exportWebappUserNavigationLogs from './userNavigationLogsController/exportWebappSessions';

export default () => ({
    config: {
        list: configList,
    },
    contact: {
        contact: contactContact,
    },
    contactFormReferral: {
        export: contactFormReferralExport,
    },
    directory: {
        list: directoryList,
    },
    geo: {
        get: geoGet,
        getDepartementsForEpci: geoGetDepartementsForEpci,
        getDepartementsForRegion: geoGetDepartementsForRegion,
        listDepartements: geoListDepartements,
        search: geoSearch,
        searchCities: geoSearchCities,
        searchEpci: geoSearchEpci,
    },
    invite: {
        invite: inviteInvite,
    },
    note: {
        addPublication: noteAddPublication,
        create: noteCreate,
        addCopy: noteAddCopy,
    },
    organization: {
        categories: organizationCategories,
        getByCategory: organizationGetByCategory,
        getByType: organizationGetByType,
        getMembers: organizationGetMembers,
        search: organizationSearch,
        types: organizationTypes,
        updateBeingFunded: organizationUpdateBeingFunded,
    },
    plan: {
        addState: planAddState,
        close: planClose,
        create: planCreate,
        delete: planDelete,
        find: planFind,
        list: planList,
        listExport: planListExport,
        update: planUpdate,
    },
    planComment: {
        create: createPlanComment,
        export: exportComments,
    },
    poi: {
        findAll: poiFindAll,
    },
    shantytownComment: {
        create: createShantytownComment,
        export: exportShantytownComment,
    },
    stats: {
        all: statsAll,
        directoryView: statsDirectoryView,
        export: statsExport,
        getDashboardStats: statsGetDashboardStats,
        public: statsPublic,
    },
    town: townController,
    user: {
        acceptCharte: userAcceptCharte,
        activate: userActivate,
        checkActivationToken: userCheckActivationToken,
        checkPasswordToken: userCheckPasswordToken,
        create: userCreate,
        denyAccess: userDenyAccess,
        edit: userEdit,
        get: userGet,
        getLatestActivationLink: userGetLatestActivationLink,
        list: userList,
        listExport: userListExport,
        me: userMe,
        remove: userRemove,
        renewToken: userRenewToken,
        requestNewPassword: userRequestNewPassword,
        sendActivationLink: userSendActivationLink,
        setAdminComments: userSetAdminComments,
        setDefaultExport: userSetDefaultExport,
        setLastChangelog: userSetLastChangelog,
        setNewPassword: userSetNewPassword,
        setRoleRegular: userSetRoleRegular,
        signin: userSignin,
        updateLocalAdmin: userUpdateLocalAdmin,
        upgrade: userUpgrade,
    },
    userActivity: {
        regular: userActivityRegular,
    },
    userNavigationLogs: {
        insert: insertUserNavigationLogs,
        exportForMobile: exportMobileUserNavigationLogs,
        exportForWebapp: exportWebappUserNavigationLogs,
    },
});
