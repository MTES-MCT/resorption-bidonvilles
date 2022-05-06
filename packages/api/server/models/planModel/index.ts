import deletePlan from './delete';
import findAll from './findAll';
import findOne from './findOne';
import listExport from './listExport';

export default () => ({
    delete: deletePlan, // renamed to avoid conflict with reserved keyword 'delete'
    findAll,
    findOne,
    listExport,
});
