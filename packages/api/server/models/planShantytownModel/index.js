const create = require('./create');
const deletePlanShantytown = require('./delete');
const findAll = require('./findAll');
const serializePlan = require('./serializePlan');

module.exports = {
    create,
    delete: deletePlanShantytown,
    serializePlan,
    findAll,
};
