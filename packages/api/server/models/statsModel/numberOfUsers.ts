import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (departement: string): Promise<number> => {
    const rows: { count: number }[] = await sequelize.query(
        `
        SELECT COUNT(*) AS count
        FROM users
        ${departement
        ? `
        LEFT JOIN departements ON departements.code = :departementCode
        LEFT JOIN v_user_areas ON v_user_areas.user_id = users.user_id AND v_user_areas.is_main_area IS TRUE`
        : ''}
        WHERE
            users.fk_status = 'active'
            AND users.to_be_tracked IS TRUE
        ${departement
        ? `
            AND (
                :departement = ANY(v_user_areas.departements)
                OR
                departements.fk_region = ANY(v_user_areas.regions)
            )`
        : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                departement,
            },
        },
    );

    return rows[0].count;
};
