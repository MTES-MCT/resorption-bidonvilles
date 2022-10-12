const closeTown = require('./closeTown');
const fixClosedStatus = require('./fixClosedStatus');
const setHeatwaveStatus = require('./setHeatwaveStatus');
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
const createPlanComment = require('./planComment/create');
const activityList = require('./activity/list');
const dashboardLocation = require('./dashboard/location');
const findNearbyTowns = require('./findNearbyTowns');
const exportTown = require('./exportTown');
const setUserAdminComments = require('./setUserAdminComments');
const editOrganization = require('./editOrganization');
const userGetLatestActivationLink = require('./users/getLatestActivationLink');
const userSetRoleRegular = require('./users/setRoleRegular');
const mePostNavigationLogs = require('./me/post.navigationLogs');
const findUserTowns = require('./findUserTowns');

module.exports = {
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
    planComment: {
        createPlanComment,
    },
    invite,
    activity: {
        list: activityList,
    },
    dashboard: {
        location: dashboardLocation,
    },
    user: {
        getLatestActivationLink: userGetLatestActivationLink,
        setRoleRegular: userSetRoleRegular,
    },
    me: {
        postNavigationLogs: mePostNavigationLogs,
    },
    setUserAdminComments,
    editOrganization,
    findUserTowns,
};
