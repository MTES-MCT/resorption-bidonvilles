const create = require('./create');
const find = require('./find');
const findAll = require('./findAll');

module.exports = () => ({
    create,
    find,
    findAll,
});
