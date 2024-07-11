import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { QuestionTag } from '#root/types/resources/QuestionGeneric.d';

export default (): Promise<QuestionTag[]> => sequelize.query(
    `SELECT
        uid,
        name
    FROM question_tags`,
    {
        type: QueryTypes.SELECT,
    },
);
