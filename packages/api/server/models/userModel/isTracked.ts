import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default async (id: Number): Promise<boolean> => {
    const res: any = await sequelize.query(
        `SELECT to_be_tracked
        FROM users
        WHERE user_id = :id
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    return res[0].to_be_tracked;
};
