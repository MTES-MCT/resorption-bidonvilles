const sequelize = require('#db/sequelize');

module.exports = id => sequelize.query(
    'DELETE FROM users WHERE users.user_id = :id',
    {
        replacements: {
            id,
        },
    },
);
