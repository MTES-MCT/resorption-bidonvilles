module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytown_covid_comments',
                'action_mediation_sante',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'shantytown_covid_comments',
                'sensibilisation_vaccination',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'shantytown_covid_comments',
                'equipe_mobile_depistage',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'shantytown_covid_comments',
                'equipe_mobile_vaccination',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
        ])
            .then(() => Promise.all([
                queryInterface.changeColumn(
                    'shantytown_covid_comments',
                    'action_mediation_sante',
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
                    'sensibilisation_vaccination',
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
                    'equipe_mobile_depistage',
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
                    'equipe_mobile_vaccination',
                    {
                        type: Sequelize.BOOLEAN,
                        allowNull: false,
                    },
                    {
                        transaction,
                    },
                ),
            ])),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeColumn(
                'shantytown_covid_comments',
                'action_mediation_sante',
                {
                    transaction,
                },
            ),
            queryInterface.removeColumn(
                'shantytown_covid_comments',
                'sensibilisation_vaccination',
                {
                    transaction,
                },
            ),
            queryInterface.removeColumn(
                'shantytown_covid_comments',
                'equipe_mobile_depistage',
                {
                    transaction,
                },
            ),
            queryInterface.removeColumn(
                'shantytown_covid_comments',
                'equipe_mobile_vaccination',
                {
                    transaction,
                },
            )]),
    ),

};
