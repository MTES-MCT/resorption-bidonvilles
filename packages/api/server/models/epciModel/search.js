const sequelize = require('#db/sequelize');

module.exports = search => sequelize.query(
    `SELECT
        epci.code,
        epci.name
    FROM
        epci
    WHERE
        UNACCENT(REPLACE(epci.name, '-', ' ')) ILIKE UNACCENT(REPLACE(?, '-', ' '))
    ORDER BY
        CASE
            WHEN UNACCENT(REPLACE(epci.name, '-', ' ')) ILIKE UNACCENT(REPLACE(?, '-', ' ')) THEN 1
            ELSE 2
        END,
        epci.name ASC
    LIMIT 20`,
    {
        replacements: [
            `%${search}%`,
            `${search}%`,
        ],
        type: sequelize.QueryTypes.SELECT,
    },
);
