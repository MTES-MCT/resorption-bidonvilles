import { sequelize } from '#db/sequelize';

export default id => sequelize.query(
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
