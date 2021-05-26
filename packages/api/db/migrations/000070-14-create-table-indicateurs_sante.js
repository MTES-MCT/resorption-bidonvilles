module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'indicateurs_sante',
            {
                indicateurs_sante_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                ame_valide: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                puma_valide: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                ame_en_cours: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                puma_en_cours: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                orientation: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                accompagnement: {
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
                'indicateurs_sante',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_sante_creator',
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
                'indicateurs_sante',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_sante_editor',
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
            'indicateurs_sante',
            'fk_indicateurs_sante_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'indicateurs_sante',
                'fk_indicateurs_sante_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('indicateurs_sante', { transaction })),
    ),

};
