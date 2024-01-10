import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ExpertiseTopic } from '#root/types/resources/ExpertiseTopic.d';

export default (): Promise<ExpertiseTopic[]> => sequelize.query(
    'SELECT uid, label FROM expertise_topics',
    {
        type: QueryTypes.SELECT,
    },
);
