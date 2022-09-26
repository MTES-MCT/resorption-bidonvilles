const knexFactory = require('#test/db/knex');

module.exports = rows => knexFactory()
    .insert(
        rows.map(row => ({
            status: 'open',
            address: '1 rue des sites',
            latitude: 1,
            longitude: 1,
            fk_city: '35238',
            fk_field_type: 1,
            fk_owner_type: 1,
            created_by: 1,
            is_reinstallation: false,
            ...row,
        })),
    )
    .into('shantytowns');
