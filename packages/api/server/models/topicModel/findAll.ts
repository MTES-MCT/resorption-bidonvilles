import { sequelize } from '#db/sequelize';

export default () => sequelize.query(
    `SELECT
        topics.uid AS uid,
        topics.name AS name
    FROM topics`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
