import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default () => sequelize.query(
    `SELECT
        topics.uid AS uid,
        topics.name AS name
    FROM topics`,
    {
        type: QueryTypes.SELECT,
    },
);
