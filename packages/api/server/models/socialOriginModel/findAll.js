const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        social_origins.social_origin_id AS id,
        social_origins.label AS label
    FROM social_origins`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
