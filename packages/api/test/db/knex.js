const knex = require('knex');
const config = require('#db/config/config');

let db = null;

module.exports = () => {
    if (db !== null || !process.env.DB_NAME) {
        return db;
    }

    db = knex({
        client: 'pg',
        connection: {
            database: process.env.DB_NAME,
            user: config.username,
            password: config.password,
            host: config.host,
            port: config.port,
        },
    });
    return db;
};
