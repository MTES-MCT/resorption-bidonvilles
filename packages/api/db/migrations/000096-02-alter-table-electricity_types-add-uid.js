const yesLabel = 'Oui';
const noLabel = 'Non';
const unknownLabel = 'Inconnu';

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'electricity_types',
            'uid',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => Promise.all([
                queryInterface.sequelize.query(
                    'UPDATE electricity_types SET uid = :value where label = :label',
                    {
                        transaction,
                        replacements: { value: 'inconnu', label: unknownLabel },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE electricity_types SET uid = :value where label = :label',
                    {
                        transaction,
                        replacements: { value: 'non', label: noLabel },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE electricity_types SET uid = :value where label = :label',
                    {
                        transaction,
                        replacements: { value: 'oui', label: yesLabel },
                    },
                ),
            ]))
            .then(() => queryInterface.changeColumn(
                'electricity_types',
                'uid',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn('electricity_types', 'uid', { transaction }),
    ),

};
