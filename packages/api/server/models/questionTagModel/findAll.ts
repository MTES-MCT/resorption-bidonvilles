import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        uid,
        name
    FROM question_tags`,
    {
        type: QueryTypes.SELECT,
    },
);
