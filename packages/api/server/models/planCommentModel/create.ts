import { sequelize } from '#db/sequelize';


export default async (data) => {
    const [[{ plan_comment_id }]]: any = await sequelize.query(
        `INSERT INTO plan_comments(
            description,
            fk_plan,
            created_by
        )
        VALUES (
            :description,
            :fk_plan,
            :created_by
        )
        RETURNING plan_comment_id`,
        {
            replacements: data,
        },
    );

    return plan_comment_id;
};
