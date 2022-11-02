module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'etp_types',
            [
                {
                    uid: 'social',
                    name: 'Travailleur social',
                },
                {
                    uid: 'cip',
                    name: 'CIP (Conseiller d\'insertion pro.)',
                },
                {
                    uid: 'civique',
                    name: 'Service civique',
                },
                {
                    uid: 'coordinateur',
                    name: 'Coordinateur ou chef de service',
                },
                {
                    uid: 'entretien',
                    name: 'Entretien / gardiennage',
                },
                {
                    uid: 'interprete',
                    name: 'Interprète',
                },
                {
                    uid: 'benevole',
                    name: 'Bénévole',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('etp_types'),

};
