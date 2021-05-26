function createTable(queryInterface, Sequelize, name, additionalColumns = {}) {
    return queryInterface.createTable(
        name,
        Object.assign({
            status: {
                type: Sequelize.ENUM('open', 'immediately_expelled', 'closed', 'closed_by_justice', 'closed_by_admin', 'covered'),
                allowNull: false,
                defaultValue: 'open',
            },
            closed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            address_details: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            fk_city: {
                type: Sequelize.STRING(5),
                allowNull: false,
            },
            built_at: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            fk_field_type: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_owner_type: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            population_total: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            population_couples: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            population_minors: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            access_to_electricity: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            access_to_water: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            trash_evacuation: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            justice_status: {
                type: Sequelize.ENUM,
                values: ['none', 'seized', 'rendered'],
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
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        }, additionalColumns),
    )
        .then(() => Promise.all([
            queryInterface.addConstraint(name, ['fk_city'], {
                type: 'foreign key',
                name: 'fk_shantytowns_city',
                references: {
                    table: 'cities',
                    field: 'code',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint(name, ['fk_field_type'], {
                type: 'foreign key',
                name: 'fk_shantytowns_field_type',
                references: {
                    table: 'field_types',
                    field: 'field_type_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint(name, ['fk_owner_type'], {
                type: 'foreign key',
                name: 'fk_shantytowns_owner_type',
                references: {
                    table: 'owner_types',
                    field: 'owner_type_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint(name, ['created_by'], {
                type: 'foreign key',
                name: 'fk_shantytowns_creator',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            }),

            queryInterface.addConstraint(name, ['closed_at'], {
                type: 'check',
                name: 'check_closed_after_built',
                where: {
                    [Sequelize.Op.or]: [
                        {
                            built_at: { [Sequelize.Op.eq]: null },
                        },
                        {
                            closed_at: { [Sequelize.Op.eq]: null },
                        },
                        {
                            [Sequelize.Op.and]: {
                                built_at: { [Sequelize.Op.ne]: null },
                                closed_at: {
                                    [Sequelize.Op.ne]: null,
                                    [Sequelize.Op.gt]: Sequelize.col('built_at'),
                                },
                            },
                        },
                    ],
                },
            }),

            queryInterface.addConstraint(name, ['closed_at'], {
                type: 'check',
                name: 'check_closed_at_notNull',
                where: {
                    [Sequelize.Op.or]: [
                        {
                            [Sequelize.Op.and]: {
                                status: { [Sequelize.Op.eq]: 'open' },
                                closed_at: { [Sequelize.Op.eq]: null },
                            },
                        },
                        {
                            [Sequelize.Op.and]: {
                                status: { [Sequelize.Op.ne]: 'open' },
                                closed_at: { [Sequelize.Op.ne]: null },
                            },
                        },
                    ],
                },
            }),
        ]));
}

module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        createTable(queryInterface, Sequelize, 'shantytowns', {
            shantytown_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
        }),
        createTable(queryInterface, Sequelize, 'ShantytownHistories', {
            shantytown_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
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
        }),
    ])
        .then(() => queryInterface.sequelize.query(
            `CREATE CAST (
                "enum_shantytowns_justice_status" AS "enum_ShantytownHistories_justice_status"
            ) WITH INOUT AS ASSIGNMENT`,
        )),

    down: queryInterface => Promise.all([
        queryInterface.dropTable('shantytowns'),
        queryInterface.dropTable('ShantytownHistories'),
    ]),
};
