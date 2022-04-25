const sequelize = require('#db/sequelize');

module.exports = () => sequelize.query(
    `SELECT
        owner_types.owner_type_id AS id,
        owner_types.label AS label,
        owner_types.position AS position
    FROM owner_types
    ORDER BY position ASC`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
