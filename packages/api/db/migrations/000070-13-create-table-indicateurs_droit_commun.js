module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'indicateurs_droit_commun',
            {
                indicateurs_droit_commun_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                domiciliation: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                droits_caf: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                emploi_stable: {
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
                'indicateurs_droit_commun',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_droit_commun_creator',
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
                'indicateurs_droit_commun',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_droit_commun_editor',
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
            'indicateurs_droit_commun',
            'fk_indicateurs_droit_commun_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'indicateurs_droit_commun',
                'fk_indicateurs_droit_commun_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('indicateurs_droit_commun', { transaction })),
    ),

};
