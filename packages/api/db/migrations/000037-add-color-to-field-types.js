module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'field_types',
        'color',
        {
            type: Sequelize.STRING(6),
            allowNull: false,
            defaultValue: 'cccccc',
        },
    ),

    down: queryInterface => queryInterface.removeColumn('field_types', 'color'),

};
