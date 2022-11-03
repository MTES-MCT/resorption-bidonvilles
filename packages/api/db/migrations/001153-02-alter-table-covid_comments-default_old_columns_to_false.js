module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'equipe_maraude',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'equipe_sanitaire',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'equipe_accompagnement',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'distribution_alimentaire',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
        ]),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'equipe_maraude',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'equipe_sanitaire',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'equipe_accompagnement',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.changeColumn(
                'shantytown_covid_comments',
                'distribution_alimentaire',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                {
                    transaction,
                },
            ),
        ]),
    ),

};
