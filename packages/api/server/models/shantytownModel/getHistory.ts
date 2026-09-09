import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import geoUtils from '#server/utils/geo';
import userModel from '#server/models/userModel';
import permissionUtils from '#server/utils/permission';
import { Location } from '#server/models/geoModel/Location.d';
import outremer from '#server/utils/permission/outremer';
import getUsenameOf from './_common/getUsenameOf';
import serializeShantytown from './_common/serializeShantytown';
import getDiff from './_common/getDiff';
import SQL, { ShantytownRow } from './_common/SQL';

import {
    BaseShantytownActivity,
    ShantytownActivity,
    HistoryShantytownFilter,
    HistoryResorbedFilter,
    HistoryMyTownsFilter,
} from '#root/types/resources/Activity.d';
import { User } from '#root/types/resources/User.d';

const { fromGeoLevelToTableName } = geoUtils;
const { restrict } = permissionUtils;

type ShantytownActivityRow = ShantytownRow & {
    hid: number,
    author_first_name: string,
    author_last_name: string,
    author_organization: number,
};
type HistoryFilters = {
    shantytownFilter: HistoryShantytownFilter[],
    resorbedFilter: HistoryResorbedFilter[],
    myTownsFilter: HistoryMyTownsFilter[],
};

function buildLocationRestrictionClauses(restrictedLocations: Location[]): { where: string[], replacements: Record<string, unknown> } {
    if (restrictedLocations.some(l => l.type === 'nation')) {
        return { where: [], replacements: {} };
    }

    const restrictedLocationTypes = new Set(['metropole', 'outremer']);
    const locationReplacements: Record<string, unknown> = {};

    const clause = restrictedLocations.flatMap((l, index) => {
        // On fait l'exclusion ou inclusion si c'est metropole ou outremer
        if (restrictedLocationTypes.has(l.type)) {
            locationReplacements.outreMerDepts = outremer.departements;
            return l.type === 'metropole'
                ? 'departements.code NOT IN (:outreMerDepts)'
                : 'departements.code IN (:outreMerDepts)';
        }
        locationReplacements[`shantytownLocationCode${index}`] = (l as any)[l.type].code;

        const arr = [`${fromGeoLevelToTableName(l.type)}.code = :shantytownLocationCode${index}`];
        if (l.type === 'city') {
            arr.push(`${fromGeoLevelToTableName(l.type)}.fk_main = :shantytownLocationCode${index}`);
        }

        return arr;
    }).join(' OR ');

    return { where: [clause], replacements: locationReplacements };
}

function buildActivityFiltersSQL(filters: HistoryFilters, maxDate: Date | string | null): string {
    const { shantytownFilter, resorbedFilter, myTownsFilter } = filters;

    return [
        resorbedFilter.includes('no') ? '' : 'AND shantytowns.closed_with_solutions = \'yes\'',
        resorbedFilter.includes('yes') ? '' : 'AND shantytowns.closed_with_solutions != \'yes\'',
        myTownsFilter.includes('no') ? '' : 'AND shantytown_actors.fk_user IS NOT NULL',
        myTownsFilter.includes('yes') ? '' : 'AND shantytown_actors.fk_user IS NULL',
        shantytownFilter.includes('shantytownCreation') ? '' : 'AND shantytowns.updated_at - shantytowns.created_at > \'00:00:01\'',
        shantytownFilter.includes('shantytownClosing') ? '' : 'AND shantytowns.closed_at IS NULL',
        shantytownFilter.includes('shantytownUpdate') ? '' : 'AND (shantytowns.closed_at IS NOT NULL OR shantytowns.updated_at - shantytowns.created_at <= \'00:00:01\')',
        maxDate ? 'AND shantytowns.updated_at >= :maxDate' : '',
    ].join('\n');
}

function buildActivityFromRow(activity: ShantytownActivityRow, previousVersion: any, serializedShantytown: any): ShantytownActivity | null {
    const base: BaseShantytownActivity = {
        entity: 'shantytown',
        date: activity.updatedAt.getTime() / 1000,
        author: {
            name: userModel.formatName({
                first_name: activity.author_first_name,
                last_name: activity.author_last_name,
            }),
            organization: activity.author_organization,
        },
        shantytown: {
            id: activity.id,
            usename: getUsenameOf(activity),
            resorptionTarget: activity.resorptionTarget,
            city: {
                code: activity.cityCode,
                name: activity.cityName,
                main: activity.cityMain,
            },
            epci: {
                code: activity.epciCode,
                name: activity.epciName,
            },
            departement: {
                code: activity.departementCode,
                name: activity.departementName,
            },
            region: {
                code: activity.regionCode,
                name: activity.regionName,
            },
        },
    };

    if (previousVersion === null) {
        return { ...base, action: 'creation' };
    }

    if (previousVersion.closedAt === null && activity.closedAt !== null) {
        return { ...base, action: 'closing', shantytown: { ...base.shantytown, closedWithSolutions: activity.closedWithSolutions === 'yes' } };
    }

    // on utilise le nom du site dans la précédente version (au cas ou ce dernier aurait changé)
    const diff = getDiff(previousVersion, serializedShantytown);
    if (diff.length === 0) {
        return null;
    }

    return {
        ...base, action: 'update', shantytown: { ...base.shantytown, usename: getUsenameOf(previousVersion) }, diff,
    };
}

export default async function getHistory(
    user: User,
    location: Location,
    filters: HistoryFilters,
    numberOfActivities: number,
    lastDate: Date | string,
    maxDate: Date | string | null,
): Promise<ShantytownActivity[]> {
    // apply geographic level restrictions
    const replacements: any = {
        maxDate,
        userId: user.id,
        lastDate,
    };
    if (numberOfActivities !== -1) {
        replacements.numberOfActivities = numberOfActivities;
    }
    const limit = numberOfActivities !== -1 ? 'limit :numberOfActivities' : '';

    const restrictedLocations = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocations.length === 0) {
        return [];
    }

    const { where, replacements: locationReplacements } = buildLocationRestrictionClauses(restrictedLocations);
    Object.assign(replacements, locationReplacements);
    const activityFiltersSQL = buildActivityFiltersSQL(filters, maxDate);

    const activities: ShantytownActivityRow[] = await sequelize.query(
        `
            SELECT
                activities.*,
                author.first_name AS author_first_name,
                author.last_name AS author_last_name,
                author.fk_organization AS author_organization
            FROM
                ((
                    WITH
                        shantytown_computed_origins AS (SELECT
                            s.hid AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.uid || '|' || soo.label), ','), ',') AS origins
                        FROM "ShantytownHistories" s
                        LEFT JOIN "ShantytownOriginHistories" so ON so.fk_shantytown = s.hid
                        LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
                        GROUP BY s.hid),

                        electricity_access_types AS (SELECT
                            s.hid AS fk_shantytown,
                            array_remove(array_agg(eat.electricity_access_type::text), NULL) AS electricity_access_types
                        FROM "ShantytownHistories" s
                        LEFT JOIN electricity_access_types_history eat ON eat.fk_shantytown = s.hid
                        GROUP BY s.hid),

                        shantytown_toilet_types AS (SELECT
                            s.hid AS fk_shantytown,
                            array_remove(array_agg(stt.toilet_type::text), NULL) AS toilet_types
                        FROM "ShantytownHistories" s
                        LEFT JOIN shantytown_toilet_types_history stt ON stt.fk_shantytown = s.hid
                        GROUP BY s.hid)

                    SELECT
                        shantytowns.hid,
                        sco.origins AS "socialOrigins",
                        eat.electricity_access_types AS "electricityAccessTypes",
                        stt.toilet_types AS "toiletTypes",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS authorId,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')}
                    FROM "ShantytownHistories" shantytowns
                    LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.hid
                    LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.hid
                    LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.hid
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE ((${where.join(') OR (')}))` : ''}
                    ${where.length > 0 ? 'AND' : 'WHERE'} shantytowns.updated_at < :lastDate
                    ${activityFiltersSQL}
                    ORDER BY shantytowns.updated_at DESC
                    ${limit}
                    )
                UNION
                (
                    WITH
                        shantytown_computed_origins AS (SELECT
                            s.shantytown_id AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.uid || '|' || soo.label), ','), ',') AS origins
                        FROM shantytowns s
                        LEFT JOIN shantytown_origins so ON so.fk_shantytown = s.shantytown_id
                        LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
                        GROUP BY s.shantytown_id),

                        electricity_access_types AS (SELECT
                            s.shantytown_id AS fk_shantytown,
                            array_remove(array_agg(eat.electricity_access_type::text) , NULL) AS electricity_access_types
                        FROM shantytowns s
                        LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = s.shantytown_id
                        GROUP BY s.shantytown_id),

                        shantytown_toilet_types AS (SELECT
                            s.shantytown_id AS fk_shantytown,
                            array_remove(array_agg(stt.toilet_type::text), NULL) AS toilet_types
                        FROM shantytowns s
                        LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = s.shantytown_id
                        GROUP BY s.shantytown_id)

                    SELECT
                        0 as hid,
                        sco.origins AS "socialOrigins",
                        eat.electricity_access_types AS "electricityAccessTypes",
                        stt.toilet_types AS "toiletTypes",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS authorId,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
                    FROM shantytowns
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.shantytown_id
                    LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.shantytown_id
                    LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.shantytown_id
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                    ${where.length > 0 ? 'AND' : 'WHERE'} shantytowns.updated_at < :lastDate
                    ${activityFiltersSQL}
                    ORDER BY shantytowns.updated_at DESC
                    ${limit}
                )) activities
            LEFT JOIN users author ON activities.authorId = author.user_id
            WHERE activities."updatedAt" < :lastDate
            ORDER BY activities."updatedAt" DESC
            ${limit}
            `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
    const listOldestVersions = [];
    const listIdOldestVersions = [];

    // on récupère pour chaque bidonville la plus vieille version existante qui n'est pas une création
    activities.reverse();
    activities.forEach((activity: ShantytownActivityRow) => {
        if (!(listIdOldestVersions.includes(activity.id)) && (activity.updatedAt.valueOf() - activity.createdAt.valueOf() > 10)) {
            listIdOldestVersions.push(activity.id);
        }
        listOldestVersions.push([activity.id, activity.hid]);
    });
    // on récupère les précédentes versions des éléments de listIdOldestVersions afin de pouvoir appliquer getDiff
    const queryPreviousVersions: ShantytownActivityRow[] = listIdOldestVersions.length === 0 ? [] : await sequelize.query(
        `
            WITH
            shantytown_computed_origins AS (SELECT
                s.hid AS fk_shantytown,
                string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.uid || '|' || soo.label), ','), ',') AS origins
            FROM "ShantytownHistories" s
            LEFT JOIN "ShantytownOriginHistories" so ON so.fk_shantytown = s.hid
            LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
            GROUP BY s.hid),

            electricity_access_types AS (SELECT
                s.hid AS fk_shantytown,
                array_remove(array_agg(eat.electricity_access_type::text), NULL) AS electricity_access_types
            FROM "ShantytownHistories" s
            LEFT JOIN electricity_access_types_history eat ON eat.fk_shantytown = s.hid
            GROUP BY s.hid),

            shantytown_toilet_types AS (SELECT
                s.hid AS fk_shantytown,
                array_remove(array_agg(stt.toilet_type::text), NULL) AS toilet_types
            FROM "ShantytownHistories" s
            LEFT JOIN shantytown_toilet_types_history stt ON stt.fk_shantytown = s.hid
            GROUP BY s.hid),
            shantytown_parcel_owners AS (SELECT
                s.hid AS fk_shantytown,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'ownerId', po.shantytown_parcel_owner_id::integer,
                            'name', po.owner_name::text,
                            'type', po.fk_owner_type::integer,
                            'typeDetails', jsonb_build_object(
                                'id', ot.owner_type_id::integer,
                                'label', ot.label::text,
                                'position', ot.position::integer
                            ),
                            'active', po.active::boolean,
                            'createdAt', po.created_at,
                            'createdBy', jsonb_build_object(
                                'authorId', u.user_id::integer,
                                'authorFirstName', u.first_name::text,
                                'authorLastName', u.last_name::text,
                                'organizationName', COALESCE(org.name, '')::text,
                                'organizationId', org.organization_id::integer
                            )
                        )
                    ) FILTER (WHERE po.shantytown_parcel_owner_id IS NOT NULL),
                    '[]'::jsonb
                ) AS owners
            FROM "ShantytownHistories" s
            LEFT JOIN shantytown_parcel_owners_history po ON po.fk_shantytown = s.hid
            LEFT JOIN "users" u ON u.user_id = po.fk_user
            LEFT JOIN "organizations" org ON org.organization_id = u.fk_organization
            LEFT JOIN "owner_types" ot ON ot.owner_type_id = po.fk_owner_type
            GROUP BY s.hid)
            SELECT
                sco.origins AS "socialOrigins",
                eat.electricity_access_types AS "electricityAccessTypes",
                stt.toilet_types AS "toiletTypes",
                po.owners AS "owners",
                COALESCE(shantytowns.updated_by, shantytowns.created_by) AS authorId,
                ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
            FROM
                "ShantytownHistories"  AS shantytowns
            LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
            LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.hid
            LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.hid
            LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.hid
            LEFT JOIN shantytown_parcel_owners po ON po.fk_shantytown = shantytowns.hid
            LEFT JOIN users author ON COALESCE(shantytowns.updated_by, shantytowns.created_by) = author.user_id
            ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
            WHERE (shantytowns.shantytown_id, shantytowns.updated_at) IN
                (
                    SELECT sho.shantytown_id, MAX(sho.updated_at)
                    FROM "ShantytownHistories" sho
                    WHERE
                        sho.shantytown_id IN (:listIdOldestVersions)
                        AND (sho.shantytown_id, sho.hid) NOT IN (:listOldestVersions)
                        AND sho.updated_at < :lastDate
                    GROUP BY shantytown_id
               )
            `,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ...replacements,
                listIdOldestVersions,
                listOldestVersions,
            },
        },
    );

    const previousVersions = {};

    queryPreviousVersions.forEach((activity: ShantytownActivityRow) => {
        previousVersions[activity.id] = serializeShantytown(activity, user);
    });

    return activities
        .map((activity: ShantytownActivityRow) => {
            const previousVersion = previousVersions[activity.id] ?? null;
            const serializedShantytown = serializeShantytown(activity, user);
            previousVersions[activity.id] = serializedShantytown;
            return buildActivityFromRow(activity, previousVersion, serializedShantytown);
        })
        .reverse()
        .filter(activity => activity !== null);
}
