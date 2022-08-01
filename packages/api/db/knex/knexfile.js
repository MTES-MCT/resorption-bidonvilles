const config = require('#db/config/config');

module.exports = {
    client: 'pg',
    connection: {
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
    },
};
