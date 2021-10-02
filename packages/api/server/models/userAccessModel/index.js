module.exports = database => ({
    async create({
        fk_user, sent_by, expires_at, created_at,
    }, transaction = undefined) {
        const result = await database.query(
            `INSERT INTO user_accesses(
                fk_user,
                sent_by,
                expires_at,
                created_at
            ) VALUES (
                :fk_user,
                :sent_by,
                :expires_at,
                :created_at
            ) RETURNING user_access_id AS id`, {
                replacements: {
                    fk_user,
                    sent_by,
                    expires_at,
                    created_at,
                },
                transaction,
            },
        );

        return result[0][0].id;
    },

    update(user_access_id, data, transaction = undefined) {
        const params = ['used_at', 'sent_by'];

        const query = params
            // for each supported param, look if a new value is provided in object "data"
            .reduce((acc, name) => {
                if (data[name] === undefined) {
                    return acc;
                }

                return [...acc, `${name} = :${name}`];
            }, [])
            // join each query into a single string
            .join(', ');

        return database.query(
            `UPDATE user_accesses
            SET
                ${query}
            WHERE user_access_id = :user_access_id`,
            {
                replacements: Object.assign({}, data, {
                    user_access_id,
                }),
                transaction,
            },
        );
    },
});
