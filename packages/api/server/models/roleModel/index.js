const findAll = require('./findAll');
const findOne = require('./findOne');
const findOneByName = require('./findOneByName');

module.exports = () => ({
    findAll,
    findOne,
    findOneByName,
});
