const knexFactory = require('#test/db/knex');

module.exports = rows => knexFactory()
    .insert(rows)
    .into('shantytown_incoming_towns');
