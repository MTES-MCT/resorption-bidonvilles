const sequelize = require('#db/sequelize');

module.exports = search => sequelize.query(
    `SELECT
        cities.code,
        cities.name,
        departements.code AS departement
    FROM
        cities
    LEFT JOIN
        departements ON cities.fk_departement = departements.code
    WHERE
        UNACCENT(REPLACE(cities.name, '-', ' ')) ILIKE UNACCENT(REPLACE(?, '-', ' '))
    ORDER BY
        CASE
            WHEN UNACCENT(REPLACE(cities.name, '-', ' ')) ILIKE UNACCENT(REPLACE(?, '-', ' ')) THEN 1
            ELSE 2
        END,
        cities.name ASC
    LIMIT 20`,
    {
        replacements: [
            `%${search}%`,
            `${search}%`,
        ],
        type: sequelize.QueryTypes.SELECT,
    },
);
