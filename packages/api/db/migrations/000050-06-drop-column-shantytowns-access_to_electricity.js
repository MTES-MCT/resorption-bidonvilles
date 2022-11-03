function addColumn(queryInterface, Sequelize, table) {
    return queryInterface.addColumn(
        table,
        'access_to_electricity',
        {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
    );
}

function revertValues(queryInterface, table) {
    return Promise.all([
        queryInterface.sequelize.query(
            `UPDATE "${table}"
            SET access_to_electricity = :value
            WHERE shantytown_id IN (
                SELECT
                    shantytown_id
                FROM "${table}"
                LEFT JOIN electricity_types ON "${table}".fk_electricity_type = electricity_types.electricity_type_id
                WHERE label = 'Inconnu'
            )`,
            { replacements: { value: null } },
        ),
        queryInterface.sequelize.query(
            `UPDATE "${table}"
            SET access_to_electricity = :value
            WHERE shantytown_id IN (
                SELECT
                    shantytown_id
                FROM "${table}"
                LEFT JOIN electricity_types ON "${table}".fk_electricity_type = electricity_types.electricity_type_id
                WHERE label = 'Non'
            )`,
            { replacements: { value: false } },
        ),
        queryInterface.sequelize.query(
            `UPDATE "${table}"
            SET access_to_electricity = :value
            WHERE shantytown_id IN (
                SELECT
                    shantytown_id
                FROM "${table}"
                LEFT JOIN electricity_types ON "${table}".fk_electricity_type = electricity_types.electricity_type_id
                WHERE label LIKE 'Oui%'
            )`,
            { replacements: { value: true } },
        ),
    ]);
}

module.exports = {

    up: queryInterface => Promise.all([
        queryInterface.removeColumn('shantytowns', 'access_to_electricity'),
        queryInterface.removeColumn('ShantytownHistories', 'access_to_electricity'),
    ]),

    down: (queryInterface, Sequelize) => Promise.all([
        addColumn(queryInterface, Sequelize, 'shantytowns'),
        addColumn(queryInterface, Sequelize, 'ShantytownHistories'),
    ]).then(() => Promise.all([
        revertValues(queryInterface, 'shantytowns'),
        revertValues(queryInterface, 'ShantytownHistories'),
    ])),

};
