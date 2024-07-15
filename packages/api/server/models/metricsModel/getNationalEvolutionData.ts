import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import moment from 'moment';

export type NationalEvolutionMetricsRawData = {
    month: string,
    open_shantytowns_count: number,
    intra_eu_count: number,
    extra_eu_count: number,
    only_intra_eu_shantytowns_count: number,
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
), aggregated_origins AS (
  SELECT
    fk_shantytown,
    SUM(CASE WHEN fk_social_origin = 2 THEN population_total ELSE 0 END) AS intra_eu_count,
    SUM(CASE WHEN fk_social_origin = 3 THEN population_total ELSE 0 END) AS extra_eu_count
  FROM
    shantytown_origins
  JOIN
    shantytowns ON shantytowns.shantytown_id = shantytown_origins.fk_shantytown
  GROUP BY
    fk_shantytown
)
SELECT
  ms.month,
  COUNT(st.shantytown_id) AS open_shantytowns_count,
  SUM(ao.intra_eu_count) AS intra_eu_count,
  SUM(ao.extra_eu_count) AS extra_eu_count,
  COUNT(CASE WHEN ao.extra_eu_count = 0 THEN 1 END) AS only_intra_eu_shantytowns_count
FROM
  month_series ms
LEFT JOIN shantytowns st ON
  (date_trunc('month', st.built_at) <= ms.month AND
  (st.closed_at IS NULL OR date_trunc('month', st.closed_at) > ms.month)) OR
  (st.built_at IS NULL AND st.status = 'open')
LEFT JOIN aggregated_origins ao ON
  st.shantytown_id = ao.fk_shantytown
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
