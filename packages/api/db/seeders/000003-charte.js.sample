module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'chartes_engagement',
            [
                {
                    version: 2,
                    fichier: 'charte-d-engagement-resorption-bidonvilles_v2.pdf',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('chartes_engagement', { version: 2 }),
};
