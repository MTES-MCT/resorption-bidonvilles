module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'shantytown_actors',
            {
                fk_shantytown: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                themes: {
                    type: Sequelize.ARRAY(
                        Sequelize.ENUM(
                            'sante', 'education', 'emploi', 'logement', 'mediation_sociale',
                            'securite', 'humanitaire', 'diagnostic', 'pilotage',
                        ),
                    ),
                    allowNull: false,
                },
                autre: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                updated_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'shantytown_actors',
                ['fk_shantytown', 'fk_user'],
                {
                    type: 'primary key',
                    name: 'shantytown_actors_pkey',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'shantytown_actors',
                ['fk_shantytown'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_actors_shantytown',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'shantytown_actors',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_actors_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'shantytown_actors',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_actors_creator',
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
                'shantytown_actors',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_actors_editor',
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
            'shantytown_actors',
            'fk_shantytown_actors_editor',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'shantytown_actors',
                'fk_shantytown_actors_creator',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'shantytown_actors',
                'fk_shantytown_actors_user',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'shantytown_actors',
                'fk_shantytown_actors_shantytown',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'shantytown_actors',
                'shantytown_actors_pkey',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('shantytown_actors', { transaction }))
            .then(() => queryInterface.sequelize.query(
                'DROP TYPE "enum_shantytown_actors_themes"',
                {
                    transaction,
                },
            )),
    ),

};
