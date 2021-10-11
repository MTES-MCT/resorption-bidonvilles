const { sequelize } = require('#db/models');

module.exports = id => sequelize.query(
    'DELETE FROM users WHERE users.user_id = :id',
    {
        replacements: {
            id,
        },
    },
);
