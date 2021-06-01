module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'high_covid_comment_territories',
            {
                high_covid_comment_territory_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_comment: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_departement: {
                    type: Sequelize.STRING(3),
                    allowNull: false,
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
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
                'high_covid_comment_territories',
                ['fk_comment'],
                {
                    type: 'foreign key',
                    name: 'fk_high_covid_comment_territories_comment',
                    references: {
                        table: 'high_covid_comments',
                        field: 'high_covid_comment_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'high_covid_comment_territories',
                ['fk_departement'],
                {
                    type: 'foreign key',
                    name: 'fk_high_covid_comment_territories_departement',
                    references: {
                        table: 'departements',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'high_covid_comment_territories',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_high_covid_comment_territories_creator',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'high_covid_comment_territories',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_high_covid_comment_territories_editor',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'high_covid_comment_territories',
            'fk_high_covid_comment_territories_comment',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'high_covid_comment_territories',
                'fk_high_covid_comment_territories_departement',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'high_covid_comment_territories',
                'fk_high_covid_comment_territories_creator',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'high_covid_comment_territories',
                'fk_high_covid_comment_territories_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('high_covid_comment_territories', { transaction })),
    ),

};
