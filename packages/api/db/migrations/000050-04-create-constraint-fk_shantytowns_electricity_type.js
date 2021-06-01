function createConstraint(queryInterface, table) {
    return queryInterface.addConstraint(
        table,
        ['fk_electricity_type'],
        {
            type: 'foreign key',
            name: 'fk_shantytowns_electricity_type',
            references: {
                table: 'electricity_types',
                field: 'electricity_type_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    );
}

module.exports = {

    up: queryInterface => Promise.all([
        createConstraint(queryInterface, 'shantytowns'),
        createConstraint(queryInterface, 'ShantytownHistories'),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeConstraint('shantytowns', 'fk_shantytowns_electricity_type'),
        queryInterface.removeConstraint('ShantytownHistories', 'fk_shantytowns_electricity_type'),
    ]),

};
