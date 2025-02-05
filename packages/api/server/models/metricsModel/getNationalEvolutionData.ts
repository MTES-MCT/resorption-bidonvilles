import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import moment from 'moment';

export type NationalEvolutionMetricsRawData = {
    month: string,
    intra_eu_count: number,
    extra_eu_count: number,
    only_intra_eu_shantytowns_count: number,
    toutes_origin_shantytowns_count: number,
    toutes_origin_count: number,
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
        ), serie_ms AS (
            -- Evolution de la population d'un site par mois
            SELECT
              ms.month
             , max(sh.updated_at) as archives
             , st.shantytown_id
             , max(sh.hid) as archives_hid
            FROM
              month_series ms
            JOIN shantytowns st ON
              (date_trunc('month', st.built_at) <= ms.month AND
              (st.closed_at IS NULL OR date_trunc('month', st.closed_at) > ms.month)) OR
              (st.built_at IS NULL AND st.status = 'open')
            LEFT JOIN "ShantytownHistories" sh ON st.shantytown_id=sh.shantytown_id AND date_trunc('month', sh.updated_at) <= ms.month
            GROUP BY st.shantytown_id, ms.month
            ORDER BY
              ms.month ASC
        ), aggregated_origins AS (
          -- typologe de population
          SELECT
            month,
            st.shantytown_id,
            SUM(CASE WHEN date_trunc('month', st.updated_at) <= month THEN (CASE WHEN shantytown_origins.fk_social_origin = 1 THEN st.population_total ELSE 0 END) ELSE (CASE WHEN soh.fk_social_origin = 1 THEN sh.population_total ELSE 0 END) END)  AS français_count
            , SUM(CASE WHEN date_trunc('month', st.updated_at) <= month THEN (CASE WHEN shantytown_origins.fk_social_origin = 2 THEN st.population_total ELSE 0 END) ELSE (CASE WHEN soh.fk_social_origin = 2 THEN sh.population_total ELSE 0 END) END)  AS intra_eu_count
            , SUM(CASE WHEN date_trunc('month', st.updated_at) <= month THEN (CASE WHEN shantytown_origins.fk_social_origin = 3 THEN st.population_total ELSE 0 END) ELSE (CASE WHEN soh.fk_social_origin = 3 THEN sh.population_total ELSE 0 END) END)  AS extra_eu_count
            , SUM(CASE WHEN date_trunc('month', st.updated_at) <= month THEN st.population_total ELSE sh.population_total END) / COUNT(CASE WHEN date_trunc('month', st.updated_at) <= month  THEN shantytown_origins.fk_social_origin ELSE soh.fk_social_origin END) AS total_population
            -- logs de debug
            , string_agg(CAST(shantytown_origins.fk_social_origin AS text), ',' ORDER BY shantytown_origins.fk_social_origin ASC) AS origin_sites
            , string_agg(CAST(soh.fk_social_origin AS text), ',' ORDER BY soh.fk_social_origin ASC) AS histori_origin_sites
          FROM shantytowns st
          INNER JOIN serie_ms ON serie_ms.shantytown_id=st.shantytown_id
          LEFT JOIN shantytown_origins ON st.shantytown_id = shantytown_origins.fk_shantytown AND date_trunc('month', st.updated_at) <= month
          LEFT JOIN "ShantytownHistories" sh ON serie_ms.archives_hid=sh.hid AND date_trunc('month', st.updated_at) > month
          LEFT JOIN "ShantytownOriginHistories" soh ON soh.fk_shantytown=sh.hid AND date_trunc('month', st.updated_at) > month
          GROUP BY month, st.shantytown_id
          -- ORDER BY month ASC
        )
        SELECT
          serie_ms.month
          , COUNT(CASE WHEN st.shantytown_id IS NOT NULL THEN 1 END) AS toutes_origin_shantytowns_count
          , SUM (CASE WHEN date_trunc('month', st.updated_at) <= serie_ms.month  THEN st.population_total ELSE sh.population_total END) as toutes_origin_count
          , COUNT(CASE WHEN ao.extra_eu_count = 0 AND ao.français_count = 0 AND ao.intra_eu_count > 0 THEN 1 END) AS only_intra_eu_shantytowns_count
          , SUM(CASE WHEN ao.extra_eu_count = 0 AND ao.français_count = 0 THEN ao.intra_eu_count END) AS intra_eu_count
        FROM serie_ms
        LEFT JOIN "ShantytownHistories" sh ON serie_ms.archives_hid=sh.hid
        INNER JOIN shantytowns st ON serie_ms.shantytown_id=st.shantytown_id
        LEFT JOIN aggregated_origins ao ON st.shantytown_id = ao.shantytown_id AND ao.month=serie_ms.month
        JOIN
          cities AS c ON st.fk_city = c.code
        JOIN
          departements AS d ON c.fk_departement = d.code
        WHERE
          d.code NOT IN ('971', '972', '973', '974', '975', '976', '977', '978', '984', '986', '987', '988', '989') -- Exclure les départements d'outre-mer
        -- ne conserver que les sites de 10 et +, en fonction du mois
         AND (CASE WHEN date_trunc('month', st.updated_at) <= serie_ms.month  THEN st.population_total ELSE sh.population_total END) >=10
         -- on ne tient pas compte des variations de la typologie du site : on conserve la + à jour
         AND st.fk_field_type IN (2,3) -- ne conserver que bati et terrain
        GROUP BY
        serie_ms.month
        ORDER BY
         serie_ms.month ASC`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
