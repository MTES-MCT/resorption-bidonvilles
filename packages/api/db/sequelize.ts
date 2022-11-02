const Sequelize = require('sequelize');
const config = require('./config/config');

module.exports = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);
