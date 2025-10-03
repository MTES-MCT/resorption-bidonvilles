import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Heatwave } from '#root/types/resources/Heatwave.d';

export default async (): Promise<Heatwave[]> => {
    const rows: Heatwave[] = await sequelize.query(
        `SELECT
            hw.*,
            MAKE_DATE(
                DATE_PART('year', CURRENT_DATE)::int,
                DATE_PART('month', hw.start_date)::int,
                DATE_PART('day', hw.start_date)::int
            ) AS start_date,
            MAKE_DATE(
                DATE_PART('year', CURRENT_DATE)::int,
                DATE_PART('month', hw.end_date)::int,
                DATE_PART('day', hw.end_date)::int
            ) AS end_date
        FROM 
            heatwave_param hw`,
        {
            type: QueryTypes.SELECT,
        },
    );
    return rows;
};
