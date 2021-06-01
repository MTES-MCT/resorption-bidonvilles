module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'electricity_types',
        ['label'],
        {
            type: 'unique',
            name: 'uk_electricity_types_label',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'electricity_types',
        'uk_electricity_types_label',
    ),

};
