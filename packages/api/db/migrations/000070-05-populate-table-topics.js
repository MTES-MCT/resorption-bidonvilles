module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'topics',
            [
                {
                    uid: 'health',
                    name: 'Santé',
                },
                {
                    uid: 'school',
                    name: 'Éducation et scolarisation',
                },
                {
                    uid: 'work',
                    name: 'Formation et emploi',
                },
                {
                    uid: 'housing',
                    name: 'Logement',
                },
                {
                    uid: 'safety',
                    name: 'Stabilisation et sécurisation du site',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('topics'),

};
