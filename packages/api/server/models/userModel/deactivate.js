const { sequelize } = require('#db/models');

module.exports = id => sequelize.query(
    `UPDATE
        users
    SET
        fk_status = 'inactive'
    WHERE
        user_id = :id
    `,
    {
        replacements: {
            id,
        },
    },
);
