import attachmentDeleteAttachment from './attachment/deleteAttachment';
import closeTown from './closeTown';
import dataReportExportTowns from './dataReport/exportTownsReport';
import fixClosedStatus from './fixClosedStatus';
import setHeatwaveStatus from './setHeatwaveStatus';
import createContact from './createContact';
import createTown from './createTown';
import createUser from './createUser';
import editUser from './editUser';
import editTown from './editTown';
import reportTown from './reportTown';
import exportTowns from './exportTowns';
import addShantytownActor from './shantytownActors/addShantytownActor';
import updateShantytownActor from './shantytownActors/updateShantytownActor';
import removeShantytownActor from './shantytownActors/removeShantytownActor';
import removeShantytownActorTheme from './shantytownActors/removeShantytownActorTheme';
import inviteShantytownActor from './shantytownActors/inviteShantytownActor';
import invite from './invite';
import createShantytownComment from './shantytownComment/create';
import activityList from './activity/list';
import dashboardLocation from './dashboard/location';
import findNearbyTowns from './findNearbyTowns';
import exportTown from './exportTown';
import setUserAdminComments from './setUserAdminComments';
import editOrganization from './editOrganization';
import userDeactivate from './users/deactivate';
import userReactivate from './users/reactivate';
import userUpdatePermissionOptions from './users/updatePermissionOptions';
import userGetLatestActivationLink from './users/getLatestActivationLink';
import userSetRoleRegular from './users/setRoleRegular';
import mePostNavigationLogs from './me/post.navigationLogs';
import findUserTowns from './findUserTowns';
import createNote from './note/create';
import publishNote from './note/publish';
import createQuestion from './question/create';
import subscribeQuestion from './question/subcribe';
import createAnswer from './answer/create';

import actionCreate from './actions/create';
import actionCreateComment from './actions/createComment';
import actionUpdate from './actions/update';
import justiceReaderFindByLocation from './justiceReaders/findByLocation';
import organizationSearch from './organizations/search';
import getDepartementMetrics from './metrics/getDepartementMetrics';
import getDepartementEvolutionMetrics from './metrics/getDepartementEvolutionMetrics';
import getNationMetrics from './metrics/getNationMetrics';

export default {
    attachment: {
        deleteAttachment: attachmentDeleteAttachment,
    },
    closeTown,
    dataReport: {
        exportTownsReport: dataReportExportTowns,
    },
    fixClosedStatus,
    setHeatwaveStatus,
    createContact,
    createTown,
    editTown,
    reportTown,
    exportTowns,
    createUser,
    editUser,
    findNearbyTowns,
    exportTown,
    shantytownActors: {
        addShantytownActor,
        updateShantytownActor,
        removeShantytownActor,
        removeShantytownActorTheme,
        inviteShantytownActor,
    },
    shantytownComment: {
        createShantytownComment,
    },
    invite,
    action: {
        create: actionCreate,
        createComment: actionCreateComment,
        update: actionUpdate,
    },
    activity: {
        list: activityList,
    },
    dashboard: {
        location: dashboardLocation,
    },
    justiceReader: {
        findByLocation: justiceReaderFindByLocation,
    },
    user: {
        deactivate: userDeactivate,
        getLatestActivationLink: userGetLatestActivationLink,
        reactivate: userReactivate,
        setRoleRegular: userSetRoleRegular,
        updatePermissionOptions: userUpdatePermissionOptions,
    },
    me: {
        postNavigationLogs: mePostNavigationLogs,
    },
    metrics: {
        getDepartementMetrics,
        getDepartementEvolutionMetrics,
        getNationMetrics,
    },
    note: {
        createNote,
        publishNote,
    },
    organization: {
        search: organizationSearch,
    },
    question: {
        createQuestion,
        subscribeQuestion,
    },
    answer: {
        createAnswer,
    },
    setUserAdminComments,
    editOrganization,
    findUserTowns,
};
