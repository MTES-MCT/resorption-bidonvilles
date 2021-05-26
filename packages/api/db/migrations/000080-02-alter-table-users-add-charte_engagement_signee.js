module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'charte_engagement_signee',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'users',
                ['charte_engagement_signee'],
                {
                    type: 'foreign key',
                    name: 'fk_users_charte_engagement_signee',
                    references: {
                        table: 'chartes_engagement',
                        field: 'version',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_users_charte_engagement_signee',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'users',
                'charte_engagement_signee',
                { transaction },
            )),
    ),

};
