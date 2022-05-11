const closeTown = require('./closeTown');
const createContact = require('./createContact');
const createTown = require('./createTown');
const createUser = require('./createUser');
const editUser = require('./editUser');
const editTown = require('./editTown');
const exportTowns = require('./exportTowns');
const addShantytownActor = require('./shantytownActors/addShantytownActor');
const updateShantytownActor = require('./shantytownActors/updateShantytownActor');
const removeShantytownActor = require('./shantytownActors/removeShantytownActor');
const removeShantytownActorTheme = require('./shantytownActors/removeShantytownActorTheme');
const inviteShantytownActor = require('./shantytownActors/inviteShantytownActor');
const invite = require('./invite');
const createShantytownComment = require('./shantytownComment/create');
const activityList = require('./activity/list');
const dashboardLocation = require('./dashboard/location');
const findNearbyTowns = require('./findNearbyTowns');
const setUserAdminComments = require('./setUserAdminComments');
const editOrganization = require('./editOrganization');
const userSetRoleRegular = require('./users/setRoleRegular');
const mePostNavigationLogs = require('./me/post.navigationLogs');

module.exports = {
    closeTown,
    createContact,
    createTown,
    editTown,
    exportTowns,
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
