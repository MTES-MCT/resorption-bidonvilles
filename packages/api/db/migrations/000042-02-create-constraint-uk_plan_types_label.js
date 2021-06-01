module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_types',
        ['label'],
        {
            type: 'unique',
            name: 'uk_plan_types_label',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plan_types',
        'uk_plan_types_label',
    ),

};
