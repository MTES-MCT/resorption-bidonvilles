const knex = require('knex');
const config = require('#db/config/config');

module.exports = knex({
    client: 'pg',
    connection: {
        database: 'resorption_bidonvilles_tests_template',
        user: config.username,
        password: config.password,
        host: config.host,
        port: config.port,
    },
});
