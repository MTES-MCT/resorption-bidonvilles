
import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import userModel from '../userModel';

import { AnswerActivity } from '#root/types/resources/Activity.d';

type AnswerHistoryRow = {
    answer_id: number,
    description : string,
    question_id: number,
    date: Date,
    question: string,
    answer_author_first_name: string,
    answer_author_last_name: string,
    answer_author_organization: number,
    question_author_first_name: string,
    question_author_last_name: string,
    question_author_organization: number
};
export default async (numberOfActivities, lastDate, maxDate): Promise<AnswerActivity[]> => {
    const replacements = {
        lastDate,
        maxDate,
        numberOfActivities,
    };

    const limit = numberOfActivities !== -1 ? 'limit :numberOfActivities' : '';

    const where = [];
    where.push('answers.created_at < :lastDate');
    if (maxDate) {
        where.push('answers.created_at >= :maxDate');
    }

    const activities = await sequelize.query(
        `
        SELECT 
            answers.answer_id,
            answers.description,
            answers.fk_question AS question_id,
            answers.created_at AS "date",
            questions.question,
            answer_author.first_name AS answer_author_first_name,
            answer_author.last_name AS answer_author_last_name,
            answer_author.fk_organization as answer_author_organization,
            question_author.first_name AS question_author_first_name,
            question_author.last_name AS question_author_last_name,
            question_author.fk_organization as question_author_organization
        FROM answers
        LEFT JOIN questions on questions.question_id = answers.fk_question
        LEFT JOIN users answer_author ON answer_author.user_id = answers.created_by
        LEFT JOIN users question_author ON question_author.user_id = questions.created_by
        ${where.length > 0 ? `WHERE (${where.join(') AND (')})` : ''}
        ORDER BY answers.created_at DESC
        ${limit}
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );


    return activities
        .map((activity: AnswerHistoryRow) => {
            const o: AnswerActivity = {
                entity: 'answer',
                action: 'creation',
                date: activity.date.getTime() / 1000,
                question: {
                    id: activity.question_id,
                    question: activity.question,
                },
                question_author: {
                    name: userModel.formatName({
                        first_name: activity.question_author_first_name,
                        last_name: activity.question_author_last_name,
                    }),
                    organization: activity.question_author_organization,
                },
                answer_author: {
                    name: userModel.formatName({
                        first_name: activity.answer_author_first_name,
                        last_name: activity.answer_author_last_name,
                    }),
                    organization: activity.answer_author_organization,
                },
                answer: {
                    id: activity.answer_id,
                    description: activity.description,
                },
            };
            return o;
        });
};
