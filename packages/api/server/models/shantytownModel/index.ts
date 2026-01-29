import anonymizeOwners from './anonymizeOwners';
import create from './create';
import findAll from './findAll';
import findNearby from './findNearby';
import findOne from './findOne';
import getClosureYearRange from './getClosureYearRange';
import getComments from './_common/getComments';
import getHistory from './getHistory';
import getHistoryAtGivenDate from './getHistoryAtGivenDate';
import getUsenameOf from './_common/getUsenameOf';
import update from './update';
import serializeComment from './_common/serializeComment';
import deleteShantytown from './delete';
import fixClosedStatus from './fixClosedStatus';
import setHeatwaveStatus from './setHeatwaveStatus';

export default {
    anonymizeOwners,
    create,
    deleteShantytown,
    findAll,
    findNearby,
    findOne,
    fixClosedStatus,
    getClosureYearRange,
    getComments,
    getHistory,
    getHistoryAtGivenDate,
    getUsenameOf,
    serializeComment,
    setHeatwaveStatus,
    update,
};
