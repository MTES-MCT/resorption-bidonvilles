const sequelize = require('#db/sequelize');
const serializeRole = require('./_common/serializeRole');

module.exports = async () => {
    const roles = await sequelize.query(
        `SELECT
            roles.role_id AS id,
            roles.name AS name
        FROM roles`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return roles.map(serializeRole);
};
