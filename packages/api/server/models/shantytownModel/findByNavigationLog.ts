import { sequelize } from '#db/sequelize';
import findAll from './findAll';


export default async (user) => {
    const [ids] = await sequelize.query(
        `SELECT
            SUBSTR(page,7) AS shantytown_id
        FROM user_webapp_navigation_logs
        WHERE 
            page SIMILAR TO '/site/[0-9]+'
            AND fk_user = :userId
        GROUP BY shantytown_id
        ORDER BY max(datetime) DESC
        LIMIT 10`,
        {
            replacements: {
                userId: user.id,
            },
        },
    );
    if (ids.length === 0) {
        return [];
    }
    return findAll(user, [
        { shantytown_id: { value: ids.map(({ shantytown_id: id }) => id) } },
        {
            closed_at: {
                value: null,
            },
        },
    ]);
};
