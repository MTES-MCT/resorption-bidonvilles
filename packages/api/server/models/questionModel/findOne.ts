import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import queryString from './_common/queryString';
import serializeQuestion from './serializeQuestion';
import QuestionRow from './QuestionRow.d';
import { RawQuestion } from '#root/types/resources/QuestionRaw.d';

export default async (id: number, transaction?: Transaction): Promise<RawQuestion> => {
    const rows: QuestionRow[] = await sequelize.query(
        `${queryString}
        WHERE
            cq.question_id =  :id`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                id,
            },
            transaction,
        },
    );

    if (rows.length !== 1) {
        return null;
    }

    return serializeQuestion(rows[0]);
};
