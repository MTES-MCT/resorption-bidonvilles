const query = require('./_common/query');

module.exports = async (user, id) => {
    const rows = await query(user, 'read', {
        plan_id: id,
    });

    if (rows.length === 1) {
        return rows[0];
    }

    return null;
};
