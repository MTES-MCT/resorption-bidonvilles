const create = require('./create');
const list = require('./list');
const find = require('./find');
const findAllByActor = require('./findAllByActor');
const findByNavigationLog = require('./findByNavigationLog');
const close = require('./close');
const deleteTown = require('./deleteTown');
const deleteComment = require('./deleteComment');
const exportTown = require('./exportTown');
const createCovidComment = require('./createCovidComment');
const fixClosedStatus = require('./fixClosedStatus');
const setHeatwaveStatus = require('./setHeatwaveStatus');

module.exports = {
    create,
    list,
    find,
    findAllByActor,
    findByNavigationLog,
    close,
    deleteTown,
    deleteComment,
    exportTown,
    createCovidComment,
    fixClosedStatus,
    setHeatwaveStatus,
};
