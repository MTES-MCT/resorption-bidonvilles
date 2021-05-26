module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'indicateurs_securisation',
            {
                indicateurs_securisation_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                points_eau: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                wc: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                electricite: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                nombre_bennes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
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
                'indicateurs_securisation',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_securisation_creator',
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
                'indicateurs_securisation',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_securisation_editor',
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
            'indicateurs_securisation',
            'fk_indicateurs_securisation_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'indicateurs_securisation',
                'fk_indicateurs_securisation_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('indicateurs_securisation', { transaction })),
    ),

};
