import { sequelize } from '#db/sequelize';

type Domain = 'webapp' | 'mobile';

export default async (fk_user: Number, page: String, domain: Domain): Promise<number> => {
    const tables = {
        webapp: 'user_webapp_navigation_logs',
        mobile: 'user_mobile_navigation_logs',
    };

    if (!tables[domain]) {
        throw new Error('Invalid table name');
    }

    const response: any = await sequelize.query(
        `INSERT INTO
            ${tables[domain]}(
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
        },
    );

    return response[0][0].user_navigation_log_id;
};
