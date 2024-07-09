import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import moment from 'moment';

export type NationalEvolutionMetricsRawData = {
    month: string,
    open_shantytowns_count: number,
    intra_eu_count: number,
    extra_eu_count: number,
};

export default async (user, from: Date, to: Date): Promise<NationalEvolutionMetricsRawData[]> => {
    const replacements = {
        from: `${moment(from).format('YYYY-MM-DD')} 23:59:59`,
        to: `${moment(to).format('YYYY-MM-DD')} 23:59:59`,
    };

    return sequelize.query(
        `WITH month_series AS (
  SELECT generate_series(
    date_trunc('month', TIMESTAMP '${replacements.from}'),
    date_trunc('day', TIMESTAMP '${replacements.to}'),
    '1 month'::interval
  ) AS month
)
SELECT
  ms.month,
  COUNT(st.shantytown_id) AS open_shantytowns_count,
  SUM(CASE WHEN so.fk_social_origin = 2 THEN st.population_total ELSE 0 END) AS intra_eu_count,
  SUM(CASE WHEN so.fk_social_origin = 3 THEN st.population_total ELSE 0 END) AS extra_eu_count
FROM
  month_series ms
LEFT JOIN shantytowns st ON
  date_trunc('month', st.built_at) <= ms.month AND
  (st.closed_at IS NULL OR date_trunc('month', st.closed_at) >= ms.month)
LEFT JOIN shantytown_origins so ON
  st.shantytown_id = so.fk_shantytown
GROUP BY
  ms.month
ORDER BY
  ms.month;`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
