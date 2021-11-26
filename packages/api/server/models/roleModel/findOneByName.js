const { sequelize } = require('#db/models');

module.exports = async (name) => {
    const role = await sequelize.query(
        `SELECT
            roles.role_id AS id,
            roles.name AS "name",
            roles.type AS type
        FROM
            roles
        WHERE 
            UPPER(name) = UPPER(:name)`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                name,
            },
        },
    );

    return role.length > 0 ? role[0] : null;
};
