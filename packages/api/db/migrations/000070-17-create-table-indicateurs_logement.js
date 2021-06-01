module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'indicateurs_logement',
            {
                indicateurs_logement_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                siao: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                logement_social: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                dalo: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                accompagnes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                non_accompagnes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                heberges: {
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
                'indicateurs_logement',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_logement_creator',
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
                'indicateurs_logement',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_logement_editor',
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
            'indicateurs_logement',
            'fk_indicateurs_logement_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'indicateurs_logement',
                'fk_indicateurs_logement_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('indicateurs_logement', { transaction })),
    ),

};
