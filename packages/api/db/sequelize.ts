const Sequelize = require('sequelize');
const config = require('./config/config');

export const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);

export default sequelize;