module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'chartes_engagement',
            {
                version: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fichier: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'chartes_engagement',
                ['fichier'],
                {
                    type: 'unique',
                    name: 'uk_chartes_engagement_fichier',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'chartes_engagement',
            'uk_chartes_engagement_fichier',
            {
                transaction,
            },
        )
            .then(() => queryInterface.dropTable('chartes_engagement', { transaction })),
    ),

};
