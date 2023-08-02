import { sequelize } from '#db/sequelize';

export default (ids: number[], transaction = undefined) => sequelize.query(
    `UPDATE
        users
    SET
        fk_status = 'inactive'
    WHERE
        user_id IN (:ids)
    `,
    {
        transaction,
        replacements: {
            ids,
        },
    },
);
