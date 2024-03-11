import { sequelize } from '#db/sequelize';

export default async (fk_user: number, page: string, transaction = undefined): Promise<number> => {
    const response: any = await sequelize.query(
        `INSERT INTO
            user_webapp_navigation_logs(
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
