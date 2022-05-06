import query from './_common/query';

export default async (user, id) => {
    const rows = await query(user, 'read', {
        plan_id: id,
    });

    if (rows.length === 1) {
        return rows[0];
    }

    return null;
};
