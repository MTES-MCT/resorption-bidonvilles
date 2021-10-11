const findAll = require('./findAll');
const serializePlan = require('./serializePlan');

module.exports = () => ({
    serializePlan,
    findAll,
});
