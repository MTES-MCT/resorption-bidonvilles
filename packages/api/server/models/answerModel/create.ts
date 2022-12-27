import { sequelize } from '#db/sequelize';


export default async (data) => {
    const [[{ answer_id }]]: any = await sequelize.query(
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

    return answer_id;
};
