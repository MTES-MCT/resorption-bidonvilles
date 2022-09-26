const create = require('./create');
const deleteFinance = require('./delete');

module.exports = {
    create,
    delete: deleteFinance,
};
