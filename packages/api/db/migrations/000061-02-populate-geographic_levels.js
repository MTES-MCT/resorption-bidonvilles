module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'geographic_levels',
            [
                {
                    name: 'nation',
                },
                {
                    name: 'region',
                },
                {
                    name: 'departement',
                },
                {
                    name: 'epci',
                },
                {
                    name: 'city',
                },
                {
                    name: 'local',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('geographic_levels'),

};
