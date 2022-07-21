import * as sequelize from '#db/sequelize';
import * as moment from 'moment';
import { ActivityNationalSummary } from './types/ActivityNationalSummary';

const { formatName } = require('#server/models/userModel');
const { getUsenameOf } = require('#server/models/shantytownModel');

export default async (argFrom: Date, argTo: Date): Promise<ActivityNationalSummary> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    const raw = await sequelize.query(
        `
        WITH
            activities AS (
            SELECT
                t."activityType",
                t."city",
                t."departement",
                t."shantytownId",
                t."shantytownName",
                (SELECT regexp_matches(t."shantytownAddress", '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] AS "shantytownAddressSimple",
                t."shantytownCommentId",
                t."userFirstName",
                t."userLastName",
                t."userOrganizationId"
            FROM
            (
                -- Retrieve new shantytowns
                (
                SELECT
                    'new_shantytowns' AS "activityType",
                    c.name            AS "city",
                    c.fk_departement  AS "departement",
                    s.shantytown_id   AS "shantytownId",
                    s.name            AS "shantytownName",
                    s.address         AS "shantytownAddress",
                    NULL::bigint      AS "shantytownCommentId",
                    NULL::varchar     AS "userFirstName",
                    NULL::varchar     AS "userLastName",
                    NULL::bigint      AS "userOrganizationId"
                FROM shantytowns s
                LEFT JOIN cities c ON s.fk_city = c.code
                WHERE s.created_at >= :from
                    AND s.created_at <= :to
                )

                UNION

                -- Retrieve closed shantytowns
                (
                SELECT
                    'closed_shantytowns' AS "activityType",
                    c.name               AS "city",
                    c.fk_departement     AS "departement",
                    s.shantytown_id      AS "shantytownId",
                    s.name               AS "shantytownName",
                    s.address            AS "shantytownAddress",
                    NULL::bigint         AS "shantytownCommentId",
                    NULL::varchar        AS "userFirstName",
                    NULL::varchar        AS "userLastName",
                    NULL::bigint         AS "userOrganizationId"
                FROM shantytowns s
                LEFT JOIN cities c ON s.fk_city = c.code
                WHERE s.updated_at >= :from
                    AND s.closed_at IS NOT NULL
                )

                UNION

                -- Retrieve shantytowns updates and exclude creation/close
                (
                SELECT
                    'updated_shantytowns' AS "activityType",
                    c.name                AS "city",
                    c.fk_departement      AS "departement",
                    history.shantytown_id AS "shantytownId",
                    shantytowns.name      AS "shantytownName",
                    shantytowns.address   AS "shantytownAddress",
                    NULL::bigint          AS "shantytownCommentId",
                    NULL::varchar         AS "userFirstName",
                    NULL::varchar         AS "userLastName",
                    NULL::bigint          AS "userOrganizationId"
                FROM
                    (
                        SELECT shantytown_id, created_at, updated_at, closed_at FROM shantytowns
                        UNION
                        SELECT shantytown_id, created_at, updated_at, closed_at FROM "ShantytownHistories"
                    ) history
                LEFT JOIN shantytowns ON shantytowns.shantytown_id = history.shantytown_id
                LEFT JOIN cities c ON shantytowns.fk_city = c.code
                WHERE history.updated_at >= :from
                    AND history.updated_at <= :to
                    AND date_trunc('hour', history.updated_at) != date_trunc('hour', history.created_at)
                    AND history.closed_at is NULL
                )

                UNION

                -- Retrieve shantytowns with public comments
                (
                WITH private_comments AS (SELECT fk_comment
                    FROM
                    (SELECT fk_comment, NULL AS fk_organization, fk_user FROM shantytown_comment_user_targets
                    UNION
                    SELECT fk_comment, fk_organization, NULL AS fk_user FROM shantytown_comment_organization_targets) t
                    GROUP BY fk_comment)
                SELECT
                    'new_comments'           AS "activityType",
                    c.name                   AS "city",
                    c.fk_departement         AS "departement",
                    s.shantytown_id          AS "shantytownId",
                    s.name                   AS "shantytownName",
                    s.address                AS "shantytownAddress",
                    sc.shantytown_comment_id AS "shantytownCommentId",
                    NULL::varchar            AS "userFirstName",
                    NULL::varchar            AS "userLastName",
                    NULL::bigint             AS "userOrganizationId"
                FROM shantytown_comments sc
                LEFT JOIN private_comments pc ON sc.shantytown_comment_id = pc.fk_comment
                LEFT JOIN shantytowns s on sc.fk_shantytown = s.shantytown_id
                LEFT JOIN cities c ON s.fk_city = c.code
                WHERE sc.created_at >= :from
                    AND sc.created_at <= :to
                    AND pc.fk_comment IS NULL
                )

                UNION

                -- Retrieve new users
                (
                SELECT
                    'new_users'         AS "activityType",
                    NULL::varchar       AS "city",
                    lo.departement_code AS "departement",
                    NULL::bigint        AS "shantytownId",
                    NULL::varchar       AS "shantytownName",
                    NULL::varchar       AS "shantytownAddress",
                    NULL::bigint        AS "shantytownCommentId",
                    u.first_name        AS "userFirstName",
                    u.last_name         AS "userLastName",
                    lo.organization_id  AS "userOrganizationId"
                FROM users u
                LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
                LEFT JOIN last_user_accesses lua ON lua.fk_user = u.user_id
                WHERE  u.fk_status = 'active'
                   AND lua.used_at >= :from
                   AND lua.used_at <= :to
                   AND lo.departement_code IS NOT NULL
                )
            ) t),

            totals AS (
                SELECT
                    c.fk_departement,
                    COUNT(s.*) AS "shantytownsTotal",
                    COALESCE(SUM(s.population_total), 0) AS "populationTotal"
                FROM shantytowns s
                LEFT JOIN cities c ON s.fk_city = c.code
                WHERE closed_at IS NULL
                GROUP BY c.fk_departement
            )
        SELECT
            d.code                                 AS "departementCode",
            d.name                                 AS "departementName",
            d.fk_region                            AS "regionCode",
            COALESCE(totals."shantytownsTotal", 0) AS "shantytownsTotal",
            COALESCE(totals."populationTotal", 0)  AS "populationTotal",
            activities.*
        FROM departements d
        LEFT JOIN totals ON totals.fk_departement = d.code
        LEFT JOIN activities ON activities.departement = d.code
        WHERE "shantytownsTotal" > 0
        ORDER BY d.code ASC
        `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                from: from.format('YYYY-MM-DD'),
                to: to.format('YYYY-MM-DD'),
            },
        },
    );

    return raw.reduce((argAcc, row) => {
        const acc = { ...argAcc };
        if (acc[row.regionCode] === undefined) {
            acc[row.regionCode] = {};
        }

        if (acc[row.regionCode][row.departementCode] === undefined) {
            acc[row.regionCode][row.departementCode] = {
                has_activity: false,
                code: row.departementCode,
                name: row.departementName,
                new_shantytowns: [],
                new_shantytowns_length: 0,
                closed_shantytowns: [],
                closed_shantytowns_length: 0,
                updated_shantytowns: [],
                updated_shantytowns_length: 0,
                new_comments: [],
                new_comments_length: 0,
                new_users: [],
                new_users_length: 0,
                shantytowns_total: row.shantytownsTotal,
                population_total: row.populationTotal,
            };
        }

        // département sans activité
        if (row.activityType === null) {
            return acc;
        }

        acc[row.regionCode][row.departementCode].has_activity = true;

        // activité "nouvel utilisateur"
        if (row.activityType === 'new_users') {
            acc[row.regionCode][row.departementCode][row.activityType].push({
                name: formatName({
                    first_name: row.userFirstName,
                    last_name: row.userLastName,
                }),
                organizationId: row.userOrganizationId,
            });
            // obligatoire pour les mails car la propriété .length y est inaccessible...
            acc[row.regionCode][row.departementCode][`new_users_length`] += 1;

            return acc;
        }

        // activité lié à un site ("nouveau site", "site fermé", "site mis à jour", "nouveau commentaire")
        let summary;
        const { shantytownId } = row;
        const shantytownUsename = getUsenameOf({
            name: row.shantytownName,
            addressSimple: row.shantytownAddressSimple,
        });

        if (row.activityType === 'new_comments') {
            summary = {
                id: row.shantytownCommentId,
                city: row.city,
                shantytownId,
                shantytownUsename: shantytownUsename,
            };
        } else {
            summary = {
                id: shantytownId,
                city: row.city,
                usename: shantytownUsename,
            };
        }

        acc[row.regionCode][row.departementCode][row.activityType].push(summary);
        // obligatoire pour les mails car la propriété .length y est inaccessible...
        acc[row.regionCode][row.departementCode][`${row.activityType}_length`] += 1;

        return acc;
    }, {});
};