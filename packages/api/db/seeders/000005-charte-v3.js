module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'chartes_engagement',
            [
                {
                    version: 3,
                    fichier: 'charte-d-engagement-resorption-bidonvilles_v3.pdf',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('chartes_engagement', { version: 3 }),
};
