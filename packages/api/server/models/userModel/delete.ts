import { sequelize } from '#db/sequelize';

export default id => sequelize.query(
    'DELETE FROM users WHERE users.user_id = :id',
    {
        replacements: {
            id,
        },
    },
);
