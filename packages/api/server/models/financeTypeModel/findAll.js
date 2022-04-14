const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        finance_types.uid AS uid,
        finance_types.name AS name
    FROM finance_types`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
