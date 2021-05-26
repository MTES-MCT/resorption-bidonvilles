module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'ActionHistories',
        {
            // temporal columns
            hid: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            archivedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            // original action columns
            action_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            fk_action_type: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_city: {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            fk_epci: {
                type: Sequelize.STRING(9),
                allowNull: true,
            },
            fk_departement: {
                type: Sequelize.STRING(3),
                allowNull: true,
            },
            fk_region: {
                type: Sequelize.STRING(2),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            ended_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        },
    )
        .then(() => Promise.all([
            queryInterface.addConstraint('ActionHistories', ['fk_city', 'fk_epci', 'fk_departement', 'fk_region'], {
                type: 'check',
                name: 'check_only_one_target',
                where: {
                    [Sequelize.Op.or]: [
                        {
                            fk_city: { [Sequelize.Op.ne]: null },
                            fk_epci: { [Sequelize.Op.eq]: null },
                            fk_departement: { [Sequelize.Op.eq]: null },
                            fk_region: { [Sequelize.Op.eq]: null },
                        },
                        {
                            fk_city: { [Sequelize.Op.eq]: null },
                            fk_epci: { [Sequelize.Op.ne]: null },
                            fk_departement: { [Sequelize.Op.eq]: null },
                            fk_region: { [Sequelize.Op.eq]: null },
                        },
                        {
                            fk_city: { [Sequelize.Op.eq]: null },
                            fk_epci: { [Sequelize.Op.eq]: null },
                            fk_departement: { [Sequelize.Op.ne]: null },
                            fk_region: { [Sequelize.Op.eq]: null },
                        },
                        {
                            fk_city: { [Sequelize.Op.eq]: null },
                            fk_epci: { [Sequelize.Op.eq]: null },
                            fk_departement: { [Sequelize.Op.eq]: null },
                            fk_region: { [Sequelize.Op.ne]: null },
                        },
                    ],
                },
            }),

            queryInterface.addConstraint('ActionHistories', ['fk_action_type'], {
                type: 'foreign key',
                name: 'fk_actions_action_type',
                references: {
                    table: 'action_types',
                    field: 'action_type_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint('ActionHistories', ['fk_city'], {
                type: 'foreign key',
                name: 'fk_actions_city',
                references: {
                    table: 'cities',
                    field: 'code',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint('ActionHistories', ['fk_epci'], {
                type: 'foreign key',
                name: 'fk_actions_epci',
                references: {
                    table: 'epci',
                    field: 'code',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint('ActionHistories', ['fk_departement'], {
                type: 'foreign key',
                name: 'fk_actions_departement',
                references: {
                    table: 'departements',
                    field: 'code',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint('ActionHistories', ['fk_region'], {
                type: 'foreign key',
                name: 'fk_actions_region',
                references: {
                    table: 'regions',
                    field: 'code',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint('ActionHistories', ['created_by'], {
                type: 'foreign key',
                name: 'fk_actions_creator',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint('ActionHistories', ['updated_by'], {
                type: 'foreign key',
                name: 'fk_actions_lastEditor',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint('ActionHistories', ['ended_at'], {
                type: 'check',
                name: 'check_ended_after_start',
                where: {
                    [Sequelize.Op.or]: [
                        {
                            ended_at: { [Sequelize.Op.eq]: null },
                        },
                        {
                            ended_at: {
                                [Sequelize.Op.ne]: null,
                                [Sequelize.Op.gt]: Sequelize.col('started_at'),
                            },
                        },
                    ],
                },
            }),
        ])),

    down: queryInterface => queryInterface.dropTable('ActionHistories'),
};
