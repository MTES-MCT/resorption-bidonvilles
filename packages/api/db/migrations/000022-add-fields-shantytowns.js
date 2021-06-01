function addColumnsTo(queryInterface, Sequelize, table) {
    return Promise.all([
        queryInterface.addColumn(
            table,
            'owner',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'declared_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'census_status',
            {
                type: Sequelize.ENUM('none', 'scheduled', 'done'),
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'census_conducted_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'census_requested_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'census_conducted_by',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'justice_rendered_by',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'justice_rendered_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'police_status',
            {
                type: Sequelize.ENUM('none', 'requested', 'granted'),
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'police_requested_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'police_granted_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            table,
            'bailiff',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
        ),
    ]);
}

function removeColumnsFrom(queryInterface, table) {
    return Promise.all([
        queryInterface.removeColumn(table, 'owner'),
        queryInterface.removeColumn(table, 'declared_at'),
        queryInterface.removeColumn(table, 'census_status'),
        queryInterface.removeColumn(table, 'census_conducted_at'),
        queryInterface.removeColumn(table, 'census_requested_at'),
        queryInterface.removeColumn(table, 'census_conducted_by'),
        queryInterface.removeColumn(table, 'justice_rendered_by'),
        queryInterface.removeColumn(table, 'justice_rendered_at'),
        queryInterface.removeColumn(table, 'police_status'),
        queryInterface.removeColumn(table, 'police_requested_at'),
        queryInterface.removeColumn(table, 'police_granted_at'),
        queryInterface.removeColumn(table, 'bailiff'),
    ]);
}

module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        addColumnsTo(queryInterface, Sequelize, 'shantytowns'),
        addColumnsTo(queryInterface, Sequelize, 'ShantytownHistories'),
    ])
        .then(() => queryInterface.sequelize.query(
            `CREATE CAST (
                "enum_shantytowns_census_status" AS "enum_ShantytownHistories_census_status"
            ) WITH INOUT AS ASSIGNMENT`,
        )),

    down: queryInterface => Promise.all([
        removeColumnsFrom(queryInterface, 'shantytowns'),
        removeColumnsFrom(queryInterface, 'ShantytownHistories'),
    ]),
};
