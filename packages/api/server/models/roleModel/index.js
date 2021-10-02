/**
 * Serializes a single role row
 *
 * @param {Object} role
 *
 * @returns {Object}
 */
function serializeRole(role) {
    return {
        id: role.id,
        name: role.name,
    };
}

module.exports = database => ({
    findAll: async () => {
        const roles = await database.query(
            `SELECT
                roles.role_id AS id,
                roles.name AS name
            FROM roles`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return roles.map(serializeRole);
    },

    findOne: async (id) => {
        const role = await database.query(
            `SELECT
                roles.role_id AS id,
                roles.name AS name
            FROM roles
            WHERE role_id = :id`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    id,
                },
            },
        );

        return role.length > 0 ? role[0] : null;
    },
});
