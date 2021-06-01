module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        (transaction) => {
            function addColumn(name) {
                return [
                    queryInterface.addColumn(
                        'shantytowns',
                        name,
                        {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        {
                            transaction,
                        },
                    ),
                    queryInterface.addColumn(
                        'ShantytownHistories',
                        name,
                        {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        {
                            transaction,
                        },
                    ),
                ];
            }

            return Promise.all([
                ...addColumn('population_minors_0_3'),
                ...addColumn('population_minors_3_6'),
                ...addColumn('population_minors_6_12'),
                ...addColumn('population_minors_12_16'),
                ...addColumn('population_minors_16_18'),
                ...addColumn('minors_in_school'),
            ]);
        },
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        (transaction) => {
            function removeColumn(name) {
                return [
                    queryInterface.removeColumn(
                        'shantytowns',
                        name,
                        { transaction },
                    ),
                    queryInterface.removeColumn(
                        'ShantytownHistories',
                        name,
                        { transaction },
                    ),
                ];
            }

            return Promise.all([
                ...removeColumn('population_minors_0_3'),
                ...removeColumn('population_minors_3_6'),
                ...removeColumn('population_minors_6_12'),
                ...removeColumn('population_minors_12_16'),
                ...removeColumn('population_minors_16_18'),
                ...removeColumn('minors_in_school'),
            ]);
        },
    ),
};
