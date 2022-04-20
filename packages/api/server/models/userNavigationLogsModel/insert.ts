import { Transaction } from "sequelize";
import { sequelize } from "#db/models";

type UserNavigationLogsInsertArgs = {
    fk_user: number,
    page: string,
};

export default async ({ fk_user, page }: UserNavigationLogsInsertArgs, transaction: Transaction = undefined): Promise<number> => {
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
