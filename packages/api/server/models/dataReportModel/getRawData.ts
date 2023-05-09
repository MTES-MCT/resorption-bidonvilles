import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type DataReportOrigins = 'european' | 'french' | 'other' | 'mixed' | null;

export type DataReportRawData = {
    shantytown_id: number,
    input_date: Date,
    known_since: Date,
    closed_at: Date,
    population_total: number,
    population_minors: number,
    minors_in_school: number,
    origins: DataReportOrigins,
    is_oversea: boolean,
};

export default async (from: Date, to: Date): Promise<DataReportRawData[]> => sequelize.query(
    `SELECT
            t.*
        FROM (
            (WITH shantytowns_today AS (
                SELECT
                    shantytowns.shantytown_id,
                    LEAST(shantytowns.built_at, shantytowns.declared_at, shantytowns.created_at) AS known_since,
                    shantytowns.closed_at,
                    departements.fk_region IN ('01', '02', '03', '04', '06') AS is_oversea
                FROM shantytowns
                LEFT JOIN cities ON shantytowns.fk_city = cities.code
                LEFT JOIN departements ON cities.fk_departement = departements.code
            ),
            shantytown_agg_origins AS (
                SELECT
                    fk_shantytown AS shantytown_id,
                    array_agg(social_origins.uid) AS origin_uids
                FROM shantytown_origins
                LEFT JOIN social_origins ON shantytown_origins.fk_social_origin = social_origins.social_origin_id
                GROUP BY fk_shantytown
            )
            SELECT
                shantytowns.shantytown_id,
                COALESCE(shantytowns.updated_at, shantytowns.created_at) AS input_date,
                shantytowns_today.known_since,
                shantytowns_today.closed_at,
                shantytowns.population_total,
                shantytowns.population_minors_0_3
                    + shantytowns.population_minors_3_6
                    + shantytowns.population_minors_6_12
                    + shantytowns.population_minors_12_16
                    + shantytowns.population_minors_16_18 AS population_minors,
                shantytowns.minors_in_school,
                CASE
                    WHEN cardinality(shantytown_agg_origins.origin_uids) = 0 THEN NULL
                    WHEN cardinality(shantytown_agg_origins.origin_uids) = 1 THEN
                        CASE
                            WHEN shantytown_agg_origins.origin_uids[1] = 'european' THEN 'european'
                            WHEN shantytown_agg_origins.origin_uids[1] = 'french' THEN 'french'
                            ELSE 'other'
                        END
                    ELSE 'mixed'
                END AS origins,
                shantytowns_today.is_oversea
            FROM shantytowns
            LEFT JOIN shantytowns_today ON shantytowns_today.shantytown_id = shantytowns.shantytown_id
            LEFT JOIN shantytown_agg_origins ON shantytown_agg_origins.shantytown_id = shantytowns.shantytown_id)

            UNION

            (WITH shantytowns_today AS (
                SELECT
                    shantytowns.shantytown_id,
                    LEAST(shantytowns.built_at, shantytowns.declared_at, shantytowns.created_at) AS known_since,
                    shantytowns.closed_at,
                    departements.fk_region IN ('01', '02', '03', '04', '06') AS is_oversea
                FROM shantytowns
                LEFT JOIN cities ON shantytowns.fk_city = cities.code
                LEFT JOIN departements ON cities.fk_departement = departements.code
            ),
            shantytown_history_agg_origins AS (
                SELECT
                    fk_shantytown AS hid,
                    array_agg(social_origins.uid) AS origin_uids
                FROM "ShantytownOriginHistories"
                LEFT JOIN social_origins ON "ShantytownOriginHistories".fk_social_origin = social_origins.social_origin_id
                GROUP BY fk_shantytown
            )
            SELECT
                "ShantytownHistories".shantytown_id,
                COALESCE("ShantytownHistories".updated_at, "ShantytownHistories".created_at) AS input_date,
                shantytowns_today.known_since,
                shantytowns_today.closed_at,
                "ShantytownHistories".population_total,
                "ShantytownHistories".population_minors_0_3
                    + "ShantytownHistories".population_minors_3_6
                    + "ShantytownHistories".population_minors_6_12
                    + "ShantytownHistories".population_minors_12_16
                    + "ShantytownHistories".population_minors_16_18 AS population_minors,
                "ShantytownHistories".minors_in_school,
                CASE
                    WHEN cardinality(shantytown_history_agg_origins.origin_uids) = 0 THEN NULL
                    WHEN cardinality(shantytown_history_agg_origins.origin_uids) = 1 THEN
                        CASE
                            WHEN shantytown_history_agg_origins.origin_uids[1] = 'european' THEN 'european'
                            WHEN shantytown_history_agg_origins.origin_uids[1] = 'french' THEN 'french'
                            ELSE 'other'
                        END
                    ELSE 'mixed'
                END AS origins,
                shantytowns_today.is_oversea
            FROM "ShantytownHistories"
            LEFT JOIN shantytowns_today ON shantytowns_today.shantytown_id = "ShantytownHistories".shantytown_id
            LEFT JOIN shantytown_history_agg_origins ON shantytown_history_agg_origins.hid = "ShantytownHistories".hid)
        ) t
        WHERE
            (t.known_since <= :to AND t.input_date <= :to)
            AND
            (t.input_date >= t.known_since)
            AND
            (t.closed_at IS NULL OR (t.closed_at > :from AND t.input_date < t.closed_at))
        ORDER BY t.shantytown_id ASC, t.input_date DESC`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            from: from.toISOString().slice(0, 10),
            to: to.toISOString().slice(0, 10),
        },
    },
);
