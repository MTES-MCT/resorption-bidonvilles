module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'ngos',
        ['name'], {
            type: 'unique',
            name: 'uk_ngos_name',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'ngos',
        'uk_ngos_name',
    ),

};
