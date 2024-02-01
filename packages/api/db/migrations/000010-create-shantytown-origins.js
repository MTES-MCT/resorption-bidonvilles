function addConstraint(queryInterface, table, constraint) {
    return queryInterface.addConstraint(table, constraint);
}

async function createTable(transaction, queryInterface, Sequelize, name, additionalColumns = {}, additionalConstraints = []) {
    await queryInterface.createTable(
        name,
        Object.assign({
            fk_shantytown: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_social_origin: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        }, additionalColumns),
        {
            transaction,
        },
    );

    await Promise.all(
        [
            queryInterface.addConstraint(name, {
                fields: ['fk_shantytown'],
                type: 'foreign key',
                name: 'fk_shantytown_origins_shantytown',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            }),

            queryInterface.addConstraint(name, {
                fields: ['fk_social_origin'],
                type: 'foreign key',
                name: 'fk_shantytown_origins_social_origin',
                references: {
                    table: 'social_origins',
                    field: 'social_origin_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            }),
        ].concat(
            additionalConstraints.map(constraint => addConstraint(queryInterface, name, {
                ...constraint,
                transaction,
            })),
        ),
    );
}

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                createTable(transaction, queryInterface, Sequelize, 'shantytown_origins', {}, [
                    {
                        fields: ['fk_shantytown', 'fk_social_origin'],
                        type: 'primary key',
                        name: 'pk_shantytown_origins',
                    },
                ]),
                createTable(transaction, queryInterface, Sequelize, 'ShantytownOriginHistories', {
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
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: queryInterface => Promise.all([
        queryInterface.dropTable('shantytown_origins'),
        queryInterface.dropTable('ShantytownOriginHistories'),
    ]),
};
