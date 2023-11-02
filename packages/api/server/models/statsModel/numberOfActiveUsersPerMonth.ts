import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

import convertToDateMapping from './_common/convertToDateMapping';

export default async (startDateStr = '2020-06-01') => {
    const rows: {
        year: string;
        month: string;
        total: string;
    }[] = await sequelize.query(
        `WITH user_dates AS (
            SELECT
                u.user_id,
                ua.used_at,
                CASE WHEN u.fk_status = 'inactive' THEN u.updated_at ELSE NULL END AS deactivated_at
            FROM user_accesses ua
            LEFT JOIN users u ON ua.fk_user = u.user_id
            WHERE ua.used_at IS NOT NULL
          )
          
          SELECT 
              EXTRACT(YEAR FROM calendar.month_start) AS year,
              EXTRACT(MONTH FROM calendar.month_start) AS month,
              COUNT(user_dates.user_id) AS total
          FROM 
          (
              SELECT generate_series(
                  ?::date,
                  NOW() - '1 month'::interval, 
                  '1 month'::interval
              ) AS month_start
          ) AS calendar
          LEFT JOIN user_dates ON user_dates.used_at <= calendar.month_start AND (user_dates.deactivated_at IS NULL OR user_dates.deactivated_at >= calendar.month_start + '1 month'::interval)
          GROUP BY calendar.month_start;`,
        {
            type: QueryTypes.SELECT,
            replacements: [startDateStr],
        },
    );

    return convertToDateMapping(rows, new Date(startDateStr));
};
