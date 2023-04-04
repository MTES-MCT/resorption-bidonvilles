import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
            user_id,
            email,
            INITCAP(first_name) AS "first_name",
            UPPER(last_name) AS "last_name"
        FROM
            users u
        WHERE
            u.fk_status = 'active'
        ORDER BY
            last_name, first_name ;`,
    {
        type: QueryTypes.SELECT,
    },
);
