import closeTown from './closeTown';
import createContact from './createContact';
import createTown from './createTown';
import createUser from './createUser';
import editUser from './editUser';
import editTown from './editTown';
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
import setUserAdminComments from './setUserAdminComments';
import editOrganization from './editOrganization';
import userSetRoleRegular from './users/setRoleRegular';
import mePostNavigationLogs from './me/post.navigationLogs';

export default {
    closeTown,
    createContact,
    createTown,
    editTown,
    createUser,
    editUser,
    findNearbyTowns,
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
    activity: {
        list: activityList,
    },
    dashboard: {
        location: dashboardLocation,
    },
    user: {
        setRoleRegular: userSetRoleRegular,
    },
    me: {
        postNavigationLogs: mePostNavigationLogs,
    },
    setUserAdminComments,
    editOrganization,
};
