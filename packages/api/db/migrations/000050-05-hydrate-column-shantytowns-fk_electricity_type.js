function hydrate(queryInterface, table, electricityTypes) {
    return Promise.all([
        queryInterface.sequelize.query(
            `UPDATE "${table}" SET fk_electricity_type = :value WHERE access_to_electricity IS NULL`,
            { replacements: { value: electricityTypes.Inconnu } },
        ),
        queryInterface.sequelize.query(
            `UPDATE "${table}" SET fk_electricity_type = :value WHERE access_to_electricity = TRUE`,
            { replacements: { value: electricityTypes.Oui } },
        ),
        queryInterface.sequelize.query(
            `UPDATE "${table}" SET fk_electricity_type = :value WHERE access_to_electricity = FALSE`,
            { replacements: { value: electricityTypes.Non } },
        ),
    ]);
}

module.exports = {

    up: queryInterface => queryInterface.sequelize.query(
        'SELECT electricity_type_id, label FROM electricity_types',
        {
            type: queryInterface.sequelize.QueryTypes.SELECT,
        },
    )
        .then(electricityTypes => electricityTypes.reduce((acc, type) => Object.assign(acc, {
            [type.label]: type.electricity_type_id,
        }), {}))
        .then(electricityTypes => Promise.all([
            hydrate(queryInterface, 'shantytowns', electricityTypes),
            hydrate(queryInterface, 'ShantytownHistories', electricityTypes),
        ])),

    down: queryInterface => Promise.all([
        queryInterface.sequelize.query('UPDATE "shantytowns" SET fk_electricity_type = NULL'),
        queryInterface.sequelize.query('UPDATE "ShantytownHistories" SET fk_electricity_type = NULL'),
    ]),

};
