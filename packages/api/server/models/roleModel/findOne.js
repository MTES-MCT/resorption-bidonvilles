const { sequelize } = require('#db/models');

module.exports = async (id) => {
    const role = await sequelize.query(
        `SELECT
            roles.role_id AS id,
            roles.name AS name
        FROM roles
        WHERE role_id = :id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    return role.length > 0 ? role[0] : null;
};
