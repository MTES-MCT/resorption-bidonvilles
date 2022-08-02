const create = require('./create');
const list = require('./list');
const find = require('./find');
const close = require('./close');
const deleteTown = require('./deleteTown');
const deleteComment = require('./deleteComment');
const exportTown = require('./exportTown');
const createCovidComment = require('./createCovidComment');
const findClosedTowns = require('./findClosedTowns');
const fixClosedStatus = require('./fixClosedStatus');

module.exports = {
    create,
    list,
    find,
    close,
    deleteTown,
    deleteComment,
    exportTown,
    createCovidComment,
    findClosedTowns,
    fixClosedStatus,
};
