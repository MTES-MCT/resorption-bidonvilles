module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'indicateurs_logement',
            'siao_people',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addColumn(
                'indicateurs_logement',
                'logement_social_people',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addColumn(
                'indicateurs_logement',
                'dalo_people',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addColumn(
                'indicateurs_logement',
                'accompagnes_people',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addColumn(
                'indicateurs_logement',
                'non_accompagnes_people',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addColumn(
                'indicateurs_logement',
                'heberges_people',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'indicateurs_logement',
            'siao_people',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'indicateurs_logement',
                'logement_social_people',
                { transaction },
            ))
            .then(() => queryInterface.removeColumn(
                'indicateurs_logement',
                'dalo_people',
                { transaction },
            ))
            .then(() => queryInterface.removeColumn(
                'indicateurs_logement',
                'accompagnes_people',
                { transaction },
            ))
            .then(() => queryInterface.removeColumn(
                'indicateurs_logement',
                'non_accompagnes_people',
                { transaction },
            ))
            .then(() => queryInterface.removeColumn(
                'indicateurs_logement',
                'heberges_people',
                { transaction },
            )),
    ),

};
