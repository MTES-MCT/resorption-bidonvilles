const knex = require('#db/knex');

module.exports = async () => {
    const shantytowns = await knex('shantytowns')
        .select('shantytowns.*')
        // city
        .join('cities', 'shantytowns.fk_city', '=', 'cities.code')
        .select({
            city_code: 'cities.code',
            city_name: 'cities.name',
            city_latitude: 'cities.latitude',
            city_longitude: 'cities.longitude',
            city_main: 'cities.fk_main',
        })
        // epci
        .join('epci', 'cities.fk_epci', '=', 'epci.code')
        .select({
            epci_code: 'epci.code',
            epci_name: 'epci.name',
        })
        // departement
        .join('departements', 'cities.fk_departement', '=', 'departements.code')
        .join('cities AS departement_chieftown', 'departements.fk_city', '=', 'departement_chieftown.code')
        .select({
            departement_code: 'departements.code',
            departement_name: 'departements.name',
            departement_latitude: 'departements.latitude',
            departement_longitude: 'departements.longitude',
            departement_chieftown_code: 'departement_chieftown.code',
            departement_chieftown_name: 'departement_chieftown.name',
            departement_chieftown_latitude: 'departement_chieftown.latitude',
            departement_chieftown_longitude: 'departement_chieftown.longitude',
        })
        // region
        .join('regions', 'departements.fk_region', '=', 'regions.code')
        .join('cities AS region_chieftown', 'regions.fk_city', '=', 'region_chieftown.code')
        .select({
            region_code: 'regions.code',
            region_name: 'regions.name',
            region_latitude: 'regions.latitude',
            region_longitude: 'regions.longitude',
            region_chieftown_code: 'region_chieftown.code',
            region_chieftown_name: 'region_chieftown.name',
            region_chieftown_latitude: 'region_chieftown.latitude',
            region_chieftown_longitude: 'region_chieftown.longitude',
        })
        .orderBy('shantytowns.updated_at', 'desc');

    const shantytownIncomingTowns = await knex('shantytown_incoming_towns')
        .leftJoin('shantytowns', 'shantytown_incoming_towns.fk_shantytown', '=', 'shantytowns.shantytown_id')
        .leftJoin('shantytowns AS incoming_towns', 'shantytown_incoming_towns.fk_incoming_town', '=', 'incoming_towns.shantytown_id')
        .select({
            shantytown_id: 'shantytowns.shantytown_id',
            incoming_town_id: 'incoming_towns.shantytown_id',
        });

    return shantytowns.map(({
        // shantytown
        shantytown_id, name, status, latitude, longitude, built_at, declared_at, address,
        address_details, population_total, population_couples, population_minors,
        population_minors_0_3, population_minors_3_6, population_minors_6_12,
        population_minors_12_16, population_minors_16_18, minors_in_school, caravans, huts,
        is_reinstallation, reinstallation_comments,
        // city
        city_name, city_code, city_latitude, city_main, city_longitude,
        // epci
        epci_code, epci_name,
        // departement
        departement_code, departement_name, departement_latitude, departement_longitude,
        departement_chieftown_code, departement_chieftown_name, departement_chieftown_latitude,
        departement_chieftown_longitude,
        // region
        region_code, region_name, region_latitude, region_longitude, region_chieftown_code,
        region_chieftown_name, region_chieftown_latitude, region_chieftown_longitude,
    }) => ({
        type: 'shantytown',
        id: shantytown_id,
        name,
        status,
        latitude,
        longitude,
        city: {
            code: city_code,
            name: city_name,
            main: city_main,
            latitude: city_latitude,
            longitude: city_longitude,
        },
        epci: {
            code: epci_code,
            name: epci_name,
        },
        departement: {
            code: departement_code,
            name: departement_name,
            latitude: departement_latitude,
            longitude: departement_longitude,
            chieftown: {
                code: departement_chieftown_code,
                name: departement_chieftown_name,
                latitude: departement_chieftown_latitude,
                longitude: departement_chieftown_longitude,
            },
        },
        region: {
            code: region_code,
            name: region_name,
            latitude: region_latitude,
            longitude: region_longitude,
            chieftown: {
                code: region_chieftown_code,
                name: region_chieftown_name,
                latitude: region_chieftown_latitude,
                longitude: region_chieftown_longitude,
            },
        },
        declaredAt: declared_at ? declared_at.getTime() / 1000 : null,
        builtAt: built_at ? built_at.getTime() / 1000 : null,
        isReinstallation: is_reinstallation,
        reinstallationComments: reinstallation_comments,
        reinstallationIncomingTowns: [],
        address,
        addressDetails: address_details,
        populationTotal: population_total,
        populationCouples: population_couples,
        populationMinors: population_minors,
        populationMinors0To3: population_minors_0_3,
        populationMinors3To6: population_minors_3_6,
        populationMinors6To12: population_minors_6_12,
        populationMinors12To16: population_minors_12_16,
        populationMinors16To18: population_minors_16_18,
        minorsInSchool: minors_in_school,
        caravans,
        huts,
    }));
};
