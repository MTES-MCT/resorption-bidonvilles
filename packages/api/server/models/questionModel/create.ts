import { sequelize } from '#db/sequelize';


export default async (data) => {
    const transaction = await sequelize.transaction();

    const [[{ communaute_question_id }]]: any = await sequelize.query(
        `INSERT INTO communaute_questions(
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
        RETURNING communaute_question_id`,
        {
            replacements: data,
            transaction,
        },
    );

    await Promise.all(data.tags.map(tag => sequelize.query(
        `INSERT INTO communaute_question_to_tags(
            fk_question,
            fk_question_tag
        )
        VALUES (
            :communaute_question_id,
            :tag
        )`,
        {
            replacements: {
                communaute_question_id,
                tag,
            },
            transaction,
        },
    )));

    await transaction.commit();

    return communaute_question_id;
};
