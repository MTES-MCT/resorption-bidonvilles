module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytown_covid_comments',
                'action_mediation_sante',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: true,
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
                    defaultValue: true,
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
                    defaultValue: true,
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
                    defaultValue: true,
                },
                {
                    transaction,
                },
            ),
        ]),
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
