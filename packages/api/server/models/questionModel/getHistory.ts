
import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import userModel from '../userModel';

import { QuestionActivity } from '#root/types/resources/Activity.d';


type QuestionHistoryRow = {
    question_id: number,
    question: string,
    people_affected: number,
    date: Date,
    tags: string[],
    other_tag: string,
    author_first_name: string,
    author_last_name: string,
    author_organization: number
};

export default async (numberOfActivities, lastDate, maxDate): Promise<QuestionActivity[]> => {
    const replacements: any = {
        lastDate,
        maxDate,
        numberOfActivities,
    };

    const limit = numberOfActivities !== -1 ? 'limit :numberOfActivities' : '';

    const where = [];
    where.push('questions.created_at < :lastDate');
    if (maxDate) {
        where.push('questions.created_at >= :maxDate');
    }

    const activities = await sequelize.query(
        `
        WITH aggregate_question_tags AS (
            SELECT 
                cq.question_id AS id,
                ARRAY_REMOVE(ARRAY_AGG(cqt.uid || '.' || cqt.name), NULL) AS tags
            FROM 
                questions cq
            LEFT JOIN
                question_to_tags cqtt ON cqtt.fk_question = cq.question_id
            LEFT JOIN
                question_tags cqt ON cqt.uid = cqtt.fk_question_tag
            GROUP BY 
                cq.question_id
        )
        SELECT 
            questions.question_id,
            questions.question,
            questions.people_affected,
            questions.created_at as "date",
            aggregate_question_tags.tags,
            questions.other_tag,
            authors.first_name AS author_first_name,
            authors.last_name AS author_last_name,
            authors.fk_organization as author_organization
        FROM questions
        LEFT JOIN users authors ON authors.user_id = questions.created_by
        LEFT JOIN aggregate_question_tags  ON aggregate_question_tags.id = questions.question_id
        ${where.length > 0 ? `WHERE (${where.join(') AND (')})` : ''}
        ORDER BY questions.created_at
        ${limit}
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );

    return activities
        .map((activity: QuestionHistoryRow) => {
            const o: QuestionActivity = {
                entity: 'question',
                action: 'creation',
                date: activity.date.getTime() / 1000,
                author: {
                    name: userModel.formatName({
                        first_name: activity.author_first_name,
                        last_name: activity.author_last_name,
                    }),
                    organization: activity.author_organization,
                },
                question: {
                    id: activity.question_id,
                    question: activity.question,
                    people_affected: activity.people_affected,
                    tags: [
                        ...activity.tags.map((tag) => {
                            const tagElt = tag.split('.');
                            return {
                                uid: tagElt[0],
                                name: tagElt[1],
                            };
                        }),

                    ],
                },
            };
            if (activity.other_tag) {
                o.question.tags.push({ uid: 'other', name: activity.other_tag });
            }
            return o;
        });
};
