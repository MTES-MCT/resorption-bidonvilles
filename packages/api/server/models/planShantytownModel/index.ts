import create from './create';
import deletePlanShantytown from './delete';
import findAll from './findAll';
import serializePlan from './serializePlan';

export default {
    create,
    delete: deletePlanShantytown,
    serializePlan,
    findAll,
};
