import anonymizeOwners from './anonymizeOwners';
import create from './create';
import findAll from './findAll';
import findNearby from './findNearby';
import findOne from './findOne';
import findRaw from './findRaw';
import getClosureYearRange from './getClosureYearRange';
import getHistory from './getHistory';
import getHistoryAtGivenDate from './getHistoryAtGivenDate';
import getUsenameOf from './_common/getUsenameOf';
import update from './update';
import deleteShantytown from './delete';
import fixClosedStatus from './fixClosedStatus';
import setHeatwaveStatus from './setHeatwaveStatus';
import setResorptionTarget from './setResorptionTarget';

export default {
    anonymizeOwners,
    create,
    deleteShantytown,
    findAll,
    findNearby,
    findOne,
    findRaw,
    fixClosedStatus,
    getClosureYearRange,
    getHistory,
    getHistoryAtGivenDate,
    getUsenameOf,
    setHeatwaveStatus,
    setResorptionTarget,
    update,
};
