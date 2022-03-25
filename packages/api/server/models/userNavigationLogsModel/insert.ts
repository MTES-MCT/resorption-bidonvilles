import { sequelize } from "#db/models";

export default async ({ fk_user, page }, transaction = undefined) => {
    const response = await sequelize.query(
        `INSERT INTO
            user_navigation_logs(
                fk_user,
                page
            )

            VALUES(
                :fk_user,
                :page
            )
            
            RETURNING user_navigation_log_id`,
        {
            replacements: {
                fk_user,
                page,
            },
            transaction,
        },
    );

    return response[0][0].user_navigation_log_id;
};
