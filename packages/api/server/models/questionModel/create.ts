import { sequelize } from '#db/sequelize';


export default async (data) => {
    const transaction = await sequelize.transaction();

    const [[{ question_id }]]: any = await sequelize.query(
        `INSERT INTO questions(
            question,
            details,
            people_affected,
            other_tags,
            created_by
        )
        VALUES (
            :question,
            :details,
            :people_affected,
            :other_tags,
            :created_by
        )
        RETURNING question_id`,
        {
            replacements: data,
            transaction,
        },
    );

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
                question_id,
                tag,
            },
            transaction,
        },
    )));

    await transaction.commit();

    return question_id;
};
