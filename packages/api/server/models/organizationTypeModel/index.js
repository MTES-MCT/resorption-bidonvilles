const findByCategory = require('./findByCategory');
const findOneById = require('./findOneById');

module.exports = () => ({
    findByCategory,
    findOneById,
});
