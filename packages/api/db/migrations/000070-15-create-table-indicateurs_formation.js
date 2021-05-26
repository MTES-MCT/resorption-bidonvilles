module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'indicateurs_formation',
            {
                indicateurs_formation_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                pole_emploi: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                pole_emploi_femmes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                mission_locale: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                mission_locale_femmes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                contrats: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                contrats_femmes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                formations: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                formations_femmes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                autoentrepreneurs: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                autoentrepreneurs_femmes: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                are: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                are_femmes: {
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
                'indicateurs_formation',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_formation_creator',
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
                'indicateurs_formation',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_indicateurs_formation_editor',
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
            'indicateurs_formation',
            'fk_indicateurs_formation_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'indicateurs_formation',
                'fk_indicateurs_formation_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('indicateurs_formation', { transaction })),
    ),

};
