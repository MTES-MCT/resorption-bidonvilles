// config
const configList = require('./configController/list');
// contact
const contactContact = require('./contactController/contact');
// contact form
const contactFormReferralExport = require('./contactFormReferralController/export');
// directory
const directoryList = require('./directoryController/list');
// geo
const geoGet = require('./geoController/get');
const geoGetDepartementsForEpci = require('./geoController/getDepartementsForEpci');
const geoGetDepartementsForRegion = require('./geoController/getDepartementsForRegion');
const geoListDepartements = require('./geoController/listDepartements');
const geoSearch = require('./geoController/search');
const geoSearchCities = require('./geoController/searchCities');
const geoSearchEpci = require('./geoController/searchEpci');
// invite
const inviteInvite = require('./inviteController/invite');
// matomo
const getWeeklyActiveUsers = require('./matomoController/getWeeklyActiveUsers');
// organization
const organizationCategories = require('./organizationController/categories');
const organizationGetByCategory = require('./organizationController/getByCategory');
const organizationGetByType = require('./organizationController/getByType');
const organizationGetMembers = require('./organizationController/getMembers');
const organizationGetMembersByCategory = require('./organizationController/getMembersByCategory');
const organizationSearch = require('./organizationController/search');
const organizationTypes = require('./organizationController/types');
const organizationUpdateBeingFunded = require('./organizationController/updateBeingFunded');
// plan
const planAddState = require('./planController/addState');
const planClose = require('./planController/close');
const planCreate = require('./planController/create');
const planDelete = require('./planController/delete');
const planFind = require('./planController/find');
const planList = require('./planController/list');
const planListExport = require('./planController/listExport');
const planUpdate = require('./planController/update');
// poi
const poiFindAll = require('./poiController/findAll');
// shantytown
const townController = require('./townController');
// shantytown comments
const createShantytownComment = require('./shantytownCommentController/create');
const exportShantytownComment = require('./shantytownCommentController/export');
// stats
const statsAll = require('./statsController/all');
const statsDirectoryView = require('./statsController/directoryView');
const statsExport = require('./statsController/export');
const statsGetDashboardStats = require('./statsController/getDashboardStats');
const statsPublic = require('./statsController/public');
// user
const userAcceptCharte = require('./userController/acceptCharte');
const userActivate = require('./userController/activate');
const userCheckActivationToken = require('./userController/checkActivationToken');
const userCheckPasswordToken = require('./userController/checkPasswordToken');
const userCreate = require('./userController/create');
const userDenyAccess = require('./userController/denyAccess');
const userEdit = require('./userController/edit');
const userGet = require('./userController/get');
const userList = require('./userController/list');
const userListExport = require('./userController/listExport');
const userMe = require('./userController/me');
const userRemove = require('./userController/remove');
const userRenewToken = require('./userController/renewToken');
const userRequestNewPassword = require('./userController/requestNewPassword');
const userSendActivationLink = require('./userController/sendActivationLink');
const userSetAdminComments = require('./userController/setAdminComments');
const userSetDefaultExport = require('./userController/setDefaultExport');
const userSetLastChangelog = require('./userController/setLastChangelog');
const userSetNewPassword = require('./userController/setNewPassword');
const userSetRoleRegular = require('./userController/setRoleRegular');
const userSignin = require('./userController/signin');
const userUpdateLocalAdmin = require('./userController/updateLocalAdmin');
const userUpgrade = require('./userController/upgrade');
// user activity
const userActivityRegular = require('./userActivityController/regular');
// user navigation logs
import insertUserNavigationLogs from './userNavigationLogsController/insert';

export default {
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
    organization: {
        categories: organizationCategories,
        getByCategory: organizationGetByCategory,
        getByType: organizationGetByType,
        getMembers: organizationGetMembers,
        getMembersByCategory: organizationGetMembersByCategory,
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
    poi: {
        findAll: poiFindAll,
    },
    matomo: {
        getWeeklyActiveUsers,
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
    },
};
