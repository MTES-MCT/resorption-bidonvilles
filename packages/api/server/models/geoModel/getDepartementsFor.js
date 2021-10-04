const { sequelize } = require('#db/models');

module.exports = (locationType, locationCode) => sequelize.query(
    `SELECT
            departements.code,
            departements.name
        FROM cities
        LEFT JOIN departements ON cities.fk_departement = departements.code
        WHERE fk_${locationType} = :locationCode
        GROUP BY departements.code, departements.name
        ORDER BY departements.code ASC`,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            locationCode,
        },
    },
);
