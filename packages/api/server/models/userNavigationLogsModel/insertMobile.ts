import { sequelize } from '#db/sequelize';

export default async (fk_user: number, page: string, origin?: string): Promise<number> => {
    const response: any = await sequelize.query(
        `INSERT INTO
            user_mobile_navigation_logs(
                fk_user,
                page,
                origin
            )

            VALUES(
                :fk_user,
                :page,
                :origin
            )
            
            RETURNING user_navigation_log_id`,
        {
            replacements: {
                fk_user,
                page,
                origin: origin || null,
            },
        },
    );

    return response[0][0].user_navigation_log_id;
};
