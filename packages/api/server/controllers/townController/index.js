const list = require('./list');
const find = require('./find');
const create = require('./create');
const close = require('./close');
const deleteTown = require('./deleteTown');
const deleteComment = require('./deleteComment');
const exportTown = require('./export');
const exportOne = require('./exportOne');
const createCovidComment = require('./createCovidComment');
const fixClosedStatus = require('./fixClosedStatus');
const edit = require('./edit');
const createHighCovidComment = require('./createHighCovidComment')();
const addActor = require('./addActor');
const updateActor = require('./updateActor');
const removeActorTheme = require('./removeActorTheme');
const inviteNewActor = require('./inviteNewActor')();
const removeActor = require('./removeActor');
const exportActors = require('./exportActors');
const getRelations = require('./getRelations')();
const findNearbyTowns = require('./findNearbyTowns')();
const findClosedNearbyTowns = require('./findClosedNearbyTowns')();


module.exports = {
    list,
    find,
    create,
    close,
    deleteTown,
    deleteComment,
    exportTown,
    exportOne,
    createCovidComment,
    fixClosedStatus,
    edit,
    createHighCovidComment,
    addActor,
    updateActor,
    removeActorTheme,
    inviteNewActor,
    removeActor,
    exportActors,
    getRelations,
    findNearbyTowns,
    findClosedNearbyTowns,
};
