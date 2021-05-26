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
            fk_closing_solution: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            number_of_people_affected: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            number_of_households_affected: {
                type: Sequelize.INTEGER,
                allowNull: true,
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
                name: 'fk_shantytown_closing_solutions_shantytown',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),

            queryInterface.addConstraint(name, ['fk_closing_solution'], {
                type: 'foreign key',
                name: 'fk_shantytown_closing_solutions_solution',
                references: {
                    table: 'closing_solutions',
                    field: 'closing_solution_id',
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
        createTable(queryInterface, Sequelize, 'shantytown_closing_solutions', {}, [
            {
                fields: ['fk_shantytown', 'fk_closing_solution'],
                options: {
                    type: 'primary key',
                    name: 'pk_shantytown_closing_solutions',
                },
            },
        ]),
        createTable(queryInterface, Sequelize, 'ShantytownClosingSolutionHistories', {
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
        queryInterface.dropTable('shantytown_closing_solutions'),
        queryInterface.dropTable('ShantytownClosingSolutionHistories'),
    ]),
};
