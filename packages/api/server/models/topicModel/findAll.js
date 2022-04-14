const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        topics.uid AS uid,
        topics.name AS name
    FROM topics`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
