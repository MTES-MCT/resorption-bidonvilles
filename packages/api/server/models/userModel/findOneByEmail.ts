import query from './_common/query';

export default async (email, filters = {}) => {
    const users = await query(
        [{ email: { value: [email.toUpperCase()], query: 'upper(users.email)' } }],
        filters,
    );

    return users.length === 1 ? users[0] : null;
};
