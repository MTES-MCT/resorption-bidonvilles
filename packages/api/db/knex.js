const knex = require('knex');
const config = require('./config/config');

module.exports = knex({
    client: 'pg',
    connection: {
        database: config.database,
        user: config.username,
        password: config.password,
        host: config.host,
        port: config.port,
    },
});
