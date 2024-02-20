const Sequelize = require('sequelize');
const config = require('./config');

module.exports = new Sequelize(
    config.default.database,
    config.default.username,
    config.default.password,
    config.default,
);
