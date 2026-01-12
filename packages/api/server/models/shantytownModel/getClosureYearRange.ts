import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async function getClosureYearRange(): Promise<{ minYear: number; maxYear: number }> {
    const rows: Array<{ min_year: number; max_year: number }> = await sequelize.query(
        `SELECT
            COALESCE(EXTRACT(YEAR FROM MIN(closed_at))::integer, EXTRACT(YEAR FROM CURRENT_DATE)::integer) AS min_year,
            COALESCE(EXTRACT(YEAR FROM MAX(closed_at))::integer, EXTRACT(YEAR FROM CURRENT_DATE)::integer) AS max_year
        FROM shantytowns`,
        {
            type: QueryTypes.SELECT,
        },
    );

    // Gestion du cas où aucune donnée n'est retournée
    const currentYear = new Date().getFullYear();

    if (!rows || rows.length === 0) {
        return {
            minYear: currentYear,
            maxYear: currentYear,
        };
    }

    return {
        minYear: rows[0].min_year ?? currentYear,
        maxYear: rows[0].max_year ?? currentYear,
    };
}
