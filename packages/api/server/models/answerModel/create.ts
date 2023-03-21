import { sequelize } from '#db/sequelize';

type AnswerInput = {
    description: string,
    fk_question: number,
    created_by: number,
};

export default async (data: AnswerInput): Promise<number> => {
    const answerResponse = await sequelize.query(
        `INSERT INTO answers(
            description,
            fk_question,
            created_by
        )
        VALUES (
            :description,
            :fk_question,
            :created_by
        )
        RETURNING answer_id`,
        {
            replacements: data,
        },
    );

    type ReturnValue = { answer_id: number };
    const rows: ReturnValue[] = (answerResponse[0] as unknown) as ReturnValue[];

    return rows[0].answer_id;
};
