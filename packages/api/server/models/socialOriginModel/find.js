const { sequelize } = require('#db/models');

module.exports = ids => sequelize.query(
    `SELECT
        social_origins.social_origin_id AS id,
        social_origins.label AS label
    FROM social_origins
    WHERE social_origins.social_origin_id IN (:ids)`,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            ids,
        },
    },
);
