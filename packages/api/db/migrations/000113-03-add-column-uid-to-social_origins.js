module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'social_origins',
            'uid',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => Promise.all([
                queryInterface.sequelize.query(
                    'UPDATE social_origins SET uid = \'french\' WHERE label = \'Ressortissants français\'',
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE social_origins SET uid = \'european\' WHERE label = \'Ressortissants européens\'',
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE social_origins SET uid = \'other\' WHERE label = \'Ressortissants extracommunautaires\'',
                    {
                        transaction,
                    },
                ),
            ]))
            .then(() => queryInterface.changeColumn(
                'social_origins',
                'uid',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'social_origins',
            'uid',
            {
                transaction,
            },
        ),
    ),
};
