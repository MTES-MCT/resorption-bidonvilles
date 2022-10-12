const sequelize = require('#db/sequelize');

module.exports = async (id, type = null) => {
    const replacements = {
        role_id: id,
    };

    if (type !== null) {
        replacements.type = type;
    }

    const role = await sequelize.query(
        `SELECT
            roles.role_id AS id,
            roles.name AS name
        FROM roles
        WHERE ${Object.keys(replacements).map(col => `${col} = :${col}`).join(' AND ')}`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    return role.length > 0 ? role[0] : null;
};
