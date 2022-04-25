const sequelize = require('#db/sequelize');

module.exports = (user_access_id, data, transaction = undefined) => {
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

    return sequelize.query(
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
};
