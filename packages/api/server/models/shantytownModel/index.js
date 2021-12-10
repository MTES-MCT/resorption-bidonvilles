const createCovidComment = require('./createCovidComment');
const findAll = require('./findAll');
const findNearby = require('./findNearby');
const findClosedNearby = require('./findClosedNearby');
const findOne = require('./findOne');
const getComments = require('./_common/getComments');
const getHistory = require('./getHistory');
const getUsenameOf = require('./_common/getUsenameOf');
const update = require('./update');
const serializeComment = require('./_common/serializeComment');

module.exports = () => ({
    createCovidComment,
    findAll,
    findNearby,
    findClosedNearby,
    findOne,
    getComments,
    getHistory,
    getUsenameOf,
    serializeComment,
    update,
});
