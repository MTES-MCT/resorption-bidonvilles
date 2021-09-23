const closeTown = require('./closeTown');
const createContact = require('./createContact');
const createTown = require('./createTown');
const createUser = require('./createUser');
const editUser = require('./editUser');
const editTown = require('./editTown');
const addShantytownActor = require('./shantytownActors/addShantytownActor');
const updateShantytownActor = require('./shantytownActors/updateShantytownActor');
const removeShantytownActor = require('./shantytownActors/removeShantytownActor');
const removeShantytownActorTheme = require('./shantytownActors/removeShantytownActorTheme');
const inviteShantytownActor = require('./shantytownActors/inviteShantytownActor');
const invite = require('./invite');
const createShantytownComment = require('./shantytownComment/create');
const activityList = require('./activity/list');
const userComments = require('./userComments');

module.exports = {
    closeTown,
    createContact,
    createTown,
    editTown,
    createUser,
    editUser,
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
    userComments,
};
