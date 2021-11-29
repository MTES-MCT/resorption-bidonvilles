const create = require('./create');
const findAll = require('./findAll');
const findOne = require('./findOne');
const getHistory = require('./getHistory');

module.exports = () => ({
    create,
    findAll,
    findOne,
    getHistory,
});
