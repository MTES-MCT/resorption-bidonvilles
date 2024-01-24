// action
import actionCreate from './actionController/create';
import actionCreateComment from './actionController/createComment';
import actionExportActions from './actionController/exportActions';
import actionExportComments from './actionController/exportComments';
import actionFetchOne from './actionController/fetchOne';
import findActionFinancesReadersByAction from './actionController/findActionFinancesReadersByAction';
import findActionFinancesReadersByManagers from './actionController/findActionFinancesReadersByManagers';
import actionList from './actionController/list';
import actionUpdate from './actionController/update';
// answer
import createAnswer from './answerController/create';
import deleteAnswer from './answerController/delete';
// attachment
import attachmentDeleteAttachment from './attachmentController/deleteAttachment';
// community
import communityAd from './communityController/ad';
import communitySubscribe from './communityController/subscribe';
import communityUnsubscribe from './communityController/unsubscribe';
// config
import configList from './configController/list';
// contact
import contactContact from './contactController/contact';
// contact form
import contactFormReferralExport from './contactFormReferralController/export';
// data report
import dataReportExportTowns from './dataReportController/exportTownsReport';
// directory
import directoryList from './directoryController/list';
// geo
import geoGet from './geoController/get';
import geoSearch from './geoController/search';
// invite
import inviteInvite from './inviteController/invite';
// metrics
import getDepartementMetrics from './metricsController/getDepartementMetrics';
import getDepartementEvolutionMetrics from './metricsController/getDepartementEvolutionMetrics';
import getNationMetrics from './metricsController/getNationMetrics';
// organization
import organizationCategories from './organizationController/categories';
import organizationFindJusticeReadersByLocation from './organizationController/findJusticeReadersByLocation';
import organizationGetByCategory from './organizationController/getByCategory';
import organizationGetByType from './organizationController/getByType';
import organizationGetMembers from './organizationController/getMembers';
import organizationSearch from './organizationController/search/search';
import organizationSearchAssociations from './organizationController/search/searchAssociations';
import organizationSearchTerritorialCollectivities from './organizationController/search/searchTerritorialCollectivities';
import organizationTypes from './organizationController/types';
import organizationUpdateBeingFunded from './organizationController/updateBeingFunded';
// permission
import permissionList from './permissionController/list';
// poi
import poiFindAll from './poiController/findAll';
// questions
import questionFetch from './questionController/fetch';
import questionList from './questionController/list';
import createQuestion from './questionController/create';
import deleteQuestion from './questionController/delete';
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
import userListWithPermissions from './userController/listWithPermissions';
import userMe from './userController/me';
import userDeactivate from './userController/deactivate';
import userReactivate from './userController/reactivate';
import userRenewToken from './userController/renewToken';
import userRequestNewPassword from './userController/requestNewPassword';
import userSendActivationLink from './userController/sendActivationLink';
import userSetAdminComments from './userController/setAdminComments';
import userSetDefaultExport from './userController/setDefaultExport';
import userSetExpertiseTopics from './userController/setExpertiseTopics';
import userSetLastChangelog from './userController/setLastChangelog';
import userSetNewPassword from './userController/setNewPassword';
import userSetRoleRegular from './userController/setRoleRegular';
import userSignin from './userController/signin';
import userUpdateLocalAdmin from './userController/updateLocalAdmin';
import userUpdatePermissionOptions from './userController/updatePermissionOptions';
// user activity
import userActivityGetHistory from './userActivityController/getHistory';
// user navigation logs
import insertUserNavigationLogs from './userNavigationLogsController/insert';
import exportWebappUserNavigationLogs from './userNavigationLogsController/exportWebappSessions';

export default () => ({
    action: {
        create: actionCreate,
        createComment: actionCreateComment,
        exportActions: actionExportActions,
        exportComments: actionExportComments,
        fetchOne: actionFetchOne,
        findActionFinancesReadersByAction,
        findActionFinancesReadersByManagers,
        list: actionList,
        update: actionUpdate,
    },
    answer: {
        create: createAnswer,
        delete: deleteAnswer,
    },
    attachment: {
        deleteAttachment: attachmentDeleteAttachment,
    },
    community: {
        ad: communityAd,
        subscribe: communitySubscribe,
        unsubscribe: communityUnsubscribe,
    },
    config: {
        list: configList,
    },
    contact: {
        contact: contactContact,
    },
    contactFormReferral: {
        export: contactFormReferralExport,
    },
    dataReport: {
        exportTownsReport: dataReportExportTowns,
    },
    directory: {
        list: directoryList,
    },
    geo: {
        get: geoGet,
        search: geoSearch,
    },
    invite: {
        invite: inviteInvite,
    },
    metrics: {
        getDepartementMetrics,
        getDepartementEvolutionMetrics,
        getNationMetrics,
    },
    organization: {
        categories: organizationCategories,
        findJusticeReadersByLocation: organizationFindJusticeReadersByLocation,
        getByCategory: organizationGetByCategory,
        getByType: organizationGetByType,
        getMembers: organizationGetMembers,
        search: organizationSearch,
        searchAssociations: organizationSearchAssociations,
        searchTerritorialCollectivities: organizationSearchTerritorialCollectivities,
        types: organizationTypes,
        updateBeingFunded: organizationUpdateBeingFunded,
    },
    permission: {
        list: permissionList,
    },
    poi: {
        findAll: poiFindAll,
    },
    question: {
        create: createQuestion,
        delete: deleteQuestion,
        fetch: questionFetch,
        list: questionList,

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
        deactivate: userDeactivate,
        denyAccess: userDenyAccess,
        edit: userEdit,
        get: userGet,
        getLatestActivationLink: userGetLatestActivationLink,
        list: userList,
        listExport: userListExport,
        listWithPermissions: userListWithPermissions,
        me: userMe,
        updatePermissionOptions: userUpdatePermissionOptions,
        reactivate: userReactivate,
        renewToken: userRenewToken,
        requestNewPassword: userRequestNewPassword,
        sendActivationLink: userSendActivationLink,
        setAdminComments: userSetAdminComments,
        setDefaultExport: userSetDefaultExport,
        setExpertiseTopics: userSetExpertiseTopics,
        setLastChangelog: userSetLastChangelog,
        setNewPassword: userSetNewPassword,
        setRoleRegular: userSetRoleRegular,
        signin: userSignin,
        updateLocalAdmin: userUpdateLocalAdmin,
    },
    userActivity: {
        getHistory: userActivityGetHistory,
    },
    userNavigationLogs: {
        insert: insertUserNavigationLogs,
        exportForWebapp: exportWebappUserNavigationLogs,
    },
});
