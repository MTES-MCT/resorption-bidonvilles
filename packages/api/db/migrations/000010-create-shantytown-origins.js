function addConstraint(queryInterface, table, constraint) {
    return queryInterface.addConstraint(table, constraint.fields, constraint.options);
}

function createTable(queryInterface, Sequelize, name, additionalColumns = {}, additionalConstraints = []) {
    return queryInterface.createTable(
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
    ).then(() => Promise.all(
        [
            queryInterface.addConstraint(name, ['fk_shantytown'], {
                type: 'foreign key',
                name: 'fk_shantytown_origins_shantytown',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),

            queryInterface.addConstraint(name, ['fk_social_origin'], {
                type: 'foreign key',
                name: 'fk_shantytown_origins_social_origin',
                references: {
                    table: 'social_origins',
                    field: 'social_origin_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),
        ].concat(
            additionalConstraints.map(addConstraint.bind(this, queryInterface, name)),
        ),
    ));
}

module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        createTable(queryInterface, Sequelize, 'shantytown_origins', {}, [
            {
                fields: ['fk_shantytown', 'fk_social_origin'],
                options: {
                    type: 'primary key',
                    name: 'pk_shantytown_origins',
                },
            },
        ]),
        createTable(queryInterface, Sequelize, 'ShantytownOriginHistories', {
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
    ]),

    down: queryInterface => Promise.all([
        queryInterface.dropTable('shantytown_origins'),
        queryInterface.dropTable('ShantytownOriginHistories'),
    ]),
};
