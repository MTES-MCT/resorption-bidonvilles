import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Topic } from '#root/types/resources/Topic.d';

export default (): Promise<Topic[]> => sequelize.query(
    `SELECT
        topics.uid AS uid,
        topics.name AS name
    FROM topics`,
    {
        type: QueryTypes.SELECT,
    },
);
