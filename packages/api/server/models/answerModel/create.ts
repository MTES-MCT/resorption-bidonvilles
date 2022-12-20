import { sequelize } from '#db/sequelize';


export default async (data) => {
    const [[{ communaute_answer_id }]]: any = await sequelize.query(
        `INSERT INTO communaute_answers(
            description,
            fk_question,
            created_by
        )
        VALUES (
            :description,
            :fk_question,
            :created_by
        )
        RETURNING communaute_answer_id`,
        {
            replacements: data,
        },
    );

    return communaute_answer_id;
};
