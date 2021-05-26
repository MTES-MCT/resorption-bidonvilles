module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'funding_types',
        ['label'],
        {
            type: 'unique',
            name: 'uk_funding_types_label',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'funding_types',
        'uk_funding_types_label',
    ),

};
