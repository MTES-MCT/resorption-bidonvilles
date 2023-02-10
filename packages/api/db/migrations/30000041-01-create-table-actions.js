// actions
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        const definition = {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            started_at: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            ended_at: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            goals: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            fk_departement: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            location_type: {
                type: Sequelize.ENUM('eti', 'logement', 'sur_site', 'autre'),
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            location_other: {
                type: Sequelize.TEXT,
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
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        };
        function addConstraints(table) {
            return [
                queryInterface.addConstraint(table, {
                    fields: ['fk_departement'],
                    type: 'foreign key',
                    name: `fk__${table}__departement`,
                    references: {
                        table: 'departements',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
                queryInterface.addConstraint(table, {
                    fields: ['created_by'],
                    type: 'foreign key',
                    name: `fk__${table}__creator`,
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
                queryInterface.addConstraint(table, {
                    fields: ['updated_by'],
                    type: 'foreign key',
                    name: `fk__${table}__editor`,
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
                queryInterface.addConstraint(table, {
                    fields: ['started_at', 'ended_at'],
                    type: 'check',
                    name: `check_${table}_dates`,
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
                    transaction,
                }),
                queryInterface.addConstraint(table, {
                    fields: ['location_type', 'address', 'latitude', 'longitude', 'location_other'],
                    type: 'check',
                    name: `check_${table}_location_columns`,
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                location_type: { [Sequelize.Op.eq]: 'eti' },
                                address: { [Sequelize.Op.ne]: null },
                                latitude: { [Sequelize.Op.ne]: null },
                                longitude: { [Sequelize.Op.ne]: null },
                                location_other: { [Sequelize.Op.eq]: null },
                            },
                            {
                                location_type: { [Sequelize.Op.eq]: 'autre' },
                                address: { [Sequelize.Op.eq]: null },
                                latitude: { [Sequelize.Op.eq]: null },
                                longitude: { [Sequelize.Op.eq]: null },
                                location_other: { [Sequelize.Op.ne]: null },
                            },
                            {
                                location_type: { [Sequelize.Op.in]: ['logement', 'sur_site'] },
                                address: { [Sequelize.Op.eq]: null },
                                latitude: { [Sequelize.Op.eq]: null },
                                longitude: { [Sequelize.Op.eq]: null },
                                location_other: { [Sequelize.Op.eq]: null },
                            },
                        ],
                    },
                    transaction,
                }),
            ];
        }

        try {
            // création des tables
            await queryInterface.createTable(
                'actions',
                {
                    action_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    ...definition,
                },
                {
                    transaction,
                },
            );
            await queryInterface.createTable(
                'actions_history',
                {
                    hid: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    action_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    ...definition,
                },
                {
                    transaction,
                },
            );

            // création des contraintes (clés étrangères, checks...)
            await Promise.all([
                ...addConstraints('actions'),
                ...addConstraints('actions_history'),
                queryInterface.addConstraint('actions_history', {
                    fields: ['action_id'],
                    type: 'foreign key',
                    name: 'fk__actions_history__original_action',
                    references: {
                        table: 'actions',
                        field: 'action_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        function removeConstraints(table) {
            return [
                queryInterface.removeConstraint(table, `fk__${table}__departement`, { transaction }),
                queryInterface.removeConstraint(table, `fk__${table}__creator`, { transaction }),
                queryInterface.removeConstraint(table, `fk__${table}__editor`, { transaction }),
                queryInterface.removeConstraint(table, `check_${table}_dates`, { transaction }),
                queryInterface.removeConstraint(table, `check_${table}_location_columns`, { transaction }),
            ];
        }

        try {
            await Promise.all([
                ...removeConstraints('actions'),
                ...removeConstraints('actions_history'),
                queryInterface.removeConstraint('actions_history', 'fk__actions_history__original_action', {
                    transaction,
                }),
            ]);

            await Promise.all([
                queryInterface.dropTable('actions', { transaction }),
                queryInterface.dropTable('actions_history', { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
