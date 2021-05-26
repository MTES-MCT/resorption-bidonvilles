module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'finance_types',
            [
                {
                    uid: 'etatique',
                    name: 'Financements étatiques hors crédits dédiés',
                },
                {
                    uid: 'dedie',
                    name: 'Crédits dédiés à la résorption des bidonvilles',
                },
                {
                    uid: 'collectivite',
                    name: 'Cofinancement collectivité territoriale',
                },
                {
                    uid: 'europeen',
                    name: 'Financements européen',
                },
                {
                    uid: 'prive',
                    name: 'Financements privé',
                },
                {
                    uid: 'autre',
                    name: 'Autre',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('finance_types'),

};
