import closeTown from './closeTown';
import fixClosedStatus from './fixClosedStatus';
import setHeatwaveStatus from './setHeatwaveStatus';
import createContact from './createContact';
import createTown from './createTown';
import createUser from './createUser';
import editUser from './editUser';
import editTown from './editTown';
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
import userUpdatePermissionOptions from './users/updatePermissionOptions';
import userGetLatestActivationLink from './users/getLatestActivationLink';
import userSetRoleRegular from './users/setRoleRegular';
import mePostNavigationLogs from './me/post.navigationLogs';
import findUserTowns from './findUserTowns';
import createNote from './note/create';
import publishNote from './note/publish';

import actionCreate from './actions/create';
import actionCreateComment from './actions/createComment';
import actionUpdate from './actions/update';
import justiceReaderFindByLocation from './justiceReaders/findByLocation';
import organizationSearch from './organizations/search';

export default {
    closeTown,
    fixClosedStatus,
    setHeatwaveStatus,
    createContact,
    createTown,
    editTown,
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
        getLatestActivationLink: userGetLatestActivationLink,
        setRoleRegular: userSetRoleRegular,
        updatePermissionOptions: userUpdatePermissionOptions,
    },
    me: {
        postNavigationLogs: mePostNavigationLogs,
    },
    note: {
        createNote,
        publishNote,
    },
    organization: {
        search: organizationSearch,
    },
    setUserAdminComments,
    editOrganization,
    findUserTowns,
};
