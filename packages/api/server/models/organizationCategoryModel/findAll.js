const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        uid,
        name_singular,
        name_plural
    FROM organization_categories`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
