import create from './create';
import deletePlan from './delete';
import findAll from './findAll';
import findOne from './findOne';
import listExport from './listExport';
import serializeComment from './_common/serializeComment';
import getComments from './_common/getComments';
import update from './update';

export default () => ({
    create,
    delete: deletePlan, // renamed to avoid conflict with reserved keyword 'delete'
    findAll,
    findOne,
    listExport,
    serializeComment,
    getComments,
    update,
});
