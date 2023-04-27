import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import QuestionInput from './QuestionInput.d';

export default async (data: QuestionInput, argTransaction?: Transaction): Promise<number> => {
    const transaction = argTransaction !== undefined ? argTransaction : await sequelize.transaction();

    const questionResponse = await sequelize.query(
        `INSERT INTO questions(
            question,
            details,
            people_affected,
            other_tag,
            created_by
        )
        VALUES (
            :question,
            :details,
            :people_affected,
            :other_tag,
            :created_by
        )
        RETURNING question_id`,
        {
            replacements: data,
            transaction,
        },
    );

    type ReturnValue = { question_id: number };
    const rows: ReturnValue[] = (questionResponse[0] as unknown) as ReturnValue[];

    await Promise.all(data.tags.map(tag => sequelize.query(
        `INSERT INTO question_to_tags(
            fk_question,
            fk_question_tag
        )
        VALUES (
            :question_id,
            :tag
        )`,
        {
            replacements: {
                question_id: rows[0].question_id,
                tag,
            },
            transaction,
        },
    )));

    if (argTransaction === undefined) {
        await transaction.commit();
    }

    return rows[0].question_id;
};
