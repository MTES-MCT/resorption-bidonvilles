const create = require('./create');
const createCovidComment = require('./createCovidComment');
const findAll = require('./findAll');
const findClosedTowns = require('./findClosedTowns');
const findNearby = require('./findNearby');
const findOne = require('./findOne');
const getComments = require('./_common/getComments');
const getHistory = require('./getHistory');
const getHistoryAtGivenDate = require('./getHistoryAtGivenDate');
const getUsenameOf = require('./_common/getUsenameOf');
const update = require('./update');
const serializeComment = require('./_common/serializeComment');
const deleteShantytown = require('./delete');
const fixClosedStatus = require('./fixClosedStatus');


module.exports = {
    create,
    createCovidComment,
    findAll,
    findClosedTowns,
    findNearby,
    findOne,
    getComments,
    getHistory,
    getHistoryAtGivenDate,
    getUsenameOf,
    serializeComment,
    update,
    deleteShantytown,
    fixClosedStatus,
};
