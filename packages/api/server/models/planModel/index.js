const deletePlan = require('./delete');
const findAll = require('./findAll');
const findOne = require('./findOne');

module.exports = () => ({
    delete: deletePlan, // renamed to avoid conflict with reserved keyword 'delete'
    findAll,
    findOne,
});
