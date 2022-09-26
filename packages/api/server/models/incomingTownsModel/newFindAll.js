const knex = require('#db/knex');

module.exports = async () => {
    const rows = await knex('shantytown_incoming_towns')
        .select([
            'shantytown_incoming_towns.fk_shantytown',
            'shantytown_incoming_towns.fk_incoming_town',
        ])
        // incoming towns
        .leftJoin('shantytowns AS incoming_towns', 'shantytown_incoming_towns.fk_incoming_town', '=', 'incoming_towns.shantytown_id')
        .select({
            incoming_town_name: 'incoming_towns.name',
            incoming_town_address: 'incoming_towns.address',
        });

    return rows.map(({
        fk_shantytown, fk_incoming_town, incoming_town_name, incoming_town_address,
    }) => ({
        shantytownId: fk_shantytown,
        id: fk_incoming_town,
        name: incoming_town_name,
        addressSimple: incoming_town_address,
        usename: incoming_town_address,
    }));
};
