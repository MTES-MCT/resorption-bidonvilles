const { sequelize } = require('../models');

function addColumn(queryInterface, Sequelize, tableName) {
    return queryInterface.addColumn(
        tableName,
        'updated_by',
        {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    );
}

function addConstraint(queryInterface, tableName) {
    queryInterface.addConstraint(tableName, ['updated_by'], {
        type: 'foreign key',
        name: 'fk_shantytowns_editor',
        references: {
            table: 'users',
            field: 'user_id',
        },
        onUpdate: 'cascade',
        onDelete: 'restrict',
    });
}

function updateRows(tableName) {
    return sequelize.query(`UPDATE "${tableName}" SET updated_by = 3 WHERE updated_at IS NOT NULL;`);
}

module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        addColumn(queryInterface, Sequelize, 'shantytowns'),
        addColumn(queryInterface, Sequelize, 'ShantytownHistories'),
    ]).then(() => Promise.all([
        addConstraint(queryInterface, 'shantytowns'),
        addConstraint(queryInterface, 'ShantytownHistories'),
    ])).then(() => Promise.all([
        updateRows('shantytowns'),
        updateRows('ShantytownHistories'),
    ])),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('shantytowns', 'updated_by'),
        queryInterface.removeColumn('ShantytownHistories', 'updated_by'),
    ]),
};
