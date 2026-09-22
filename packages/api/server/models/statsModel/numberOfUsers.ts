import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async function numberOfUsers(departement: string): Promise<number> {
    const rows: { total: number }[] = await sequelize.query(
        `
        SELECT COUNT(*) AS total
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

    return rows[0].total;
}
