module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'indicateurs_education',
            {
                indicateurs_education_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                scolarisables: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                maternelles: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                elementaires: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                colleges: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                lycees: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                difficulte_cantine: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                difficculte_place_up2a: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                difficulte_transport: {
                    type: Sequelize.BOOLEAN,
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
                'indicateurs_education',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_education_creator',
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
                'indicateurs_education',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_education_editor',
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
            'indicateurs_education',
            'fk_indicateurs_education_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'indicateurs_education',
                'fk_indicateurs_education_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('indicateurs_education', { transaction })),
    ),

};
