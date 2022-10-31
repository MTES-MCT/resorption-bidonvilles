import create from './create';
import createCovidComment from './createCovidComment';
import findAll from './findAll';
import findAllByActor from './findAllByActor';
import findByNavigationLog from './findByNavigationLog';
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

export default () => ({
    create,
    createCovidComment,
    findAll,
    findAllByActor,
    findByNavigationLog,
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
});
