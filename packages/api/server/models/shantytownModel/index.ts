import create from './create';
import createCovidComment from './createCovidComment';
import findAll from './findAll';
import findNearby from './findNearby';
import findOne from './findOne';
import getComments from './_common/getComments';
import getHistory from './getHistory';
import getUsenameOf from './_common/getUsenameOf';
import update from './update';
import serializeComment from './_common/serializeComment';
import deleteShantytown from './delete';


export default () => ({
    create,
    createCovidComment,
    findAll,
    findNearby,
    findOne,
    getComments,
    getHistory,
    getUsenameOf,
    serializeComment,
    update,
    deleteShantytown,
});
