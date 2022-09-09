const create = require('./create');
const deletePlanManager = require('./delete');

module.exports = {
    create,
    delete: deletePlanManager,
};
