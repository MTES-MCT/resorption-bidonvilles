import anonymizeOwner from './anonymizeOwner';
import create from './create';
import findAll from './findAll';
import findNearby from './findNearby';
import findOne from './findOne';
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
    anonymizeOwner,
    create,
    findAll,
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
    setHeatwaveStatus,
};
