import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import queryString from './_common/queryString';
import serializeQuestion from './serializeQuestion';
import QuestionRow from './QuestionRow';
import { RawQuestion } from '#root/types/resources/QuestionRaw.d';

export default async (): Promise<RawQuestion[]> => {
    const rows:QuestionRow[] = await sequelize.query(
        queryString,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows.map(question => serializeQuestion(question));
};
