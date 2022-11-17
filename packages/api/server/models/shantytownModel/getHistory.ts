import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize'
import geoUtils from '#server/utils/geo';
import userModel from '#server/models/userModel';
import permissionUtils from '#server/utils/permission';
import getUsenameOf from './_common/getUsenameOf';
import serializeShantytown from './_common/serializeShantytown';
import getDiff from './_common/getDiff';
import SQL from './_common/SQL';

const { fromGeoLevelToTableName } = geoUtils;
const { restrict } = permissionUtils;

export default async (user, location, shantytownFilter, resorbedFilter, myTownsFilter, numberOfActivities, lastDate, maxDate) => {
    // apply geographic level restrictions
    const where = [];
    const replacements: any = {
        maxDate,
        userId: user.id,
    };
    const limit = numberOfActivities !== -1 ? `limit ${numberOfActivities}` : '';

    const restrictedLocation = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocation === null) {
        return [];
    }

    if (restrictedLocation.type !== 'nation') {
        where.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.code = :shantytownLocationCode`);
        if (restrictedLocation.type === 'city') {
            where.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.fk_main = :shantytownLocationCode`);
        }
        replacements.shantytownLocationCode = restrictedLocation[restrictedLocation.type].code;
    }

    const activities = await sequelize.query(
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
                            string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins
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
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        sco.origins AS "socialOrigins",
                        eat.electricity_access_types AS "electricityAccessTypes",
                        stt.toilet_types AS "toiletTypes",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')}
                    FROM "ShantytownHistories" shantytowns
                    LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.hid
                    LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.hid
                    LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.hid
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE ((${where.join(') OR (')}))` : ''}
                    ${where.length > 0 ? 'AND' : 'WHERE'} shantytowns.updated_at < '${lastDate}'
                    ${resorbedFilter.includes('no') ? '' : `AND shantytowns.closed_with_solutions = 'yes'`}
                    ${resorbedFilter.includes('yes') ? '' : `AND shantytowns.closed_with_solutions != 'yes'`}
                    ${myTownsFilter.includes('no') ? '' : 'AND shantytown_actors.fk_user IS NOT NULL'}
                    ${myTownsFilter.includes('yes') ? '' : 'AND shantytown_actors.fk_user IS NULL'}
                    ${shantytownFilter.includes('shantytownCreation') ? '' : 'AND shantytowns.updated_at - shantytowns.created_at > \'00:00:01\''}
                    ${shantytownFilter.includes('shantytownClosing') ? '' : 'AND shantytowns.closed_at IS NULL'}
                    ${shantytownFilter.includes('shantytownUpdate') ? '' : 'AND (shantytowns.closed_at IS NOT NULL OR shantytowns.updated_at - shantytowns.created_at <= \'00:00:01\')'}
                    ${maxDate ? ' AND shantytowns.updated_at >= :maxDate' : ''}
                    ORDER BY shantytowns.updated_at DESC
                    ${limit}
                    )
                UNION
                (
                    WITH
                        shantytown_computed_origins AS (SELECT
                            s.shantytown_id AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins
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
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        sco.origins AS "socialOrigins",
                        eat.electricity_access_types AS "electricityAccessTypes",
                        stt.toilet_types AS "toiletTypes",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
                    FROM shantytowns
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.shantytown_id
                    LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.shantytown_id
                    LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.shantytown_id
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                    ${where.length > 0 ? 'AND' : 'WHERE'} shantytowns.updated_at < '${lastDate}'
                    ${resorbedFilter.includes('no') ? '' : `AND shantytowns.closed_with_solutions = 'yes'`}
                    ${resorbedFilter.includes('yes') ? '' : `AND shantytowns.closed_with_solutions != 'yes'`}
                    ${myTownsFilter.includes('no') ? '' : 'AND shantytown_actors.fk_user IS NOT NULL'}
                    ${myTownsFilter.includes('yes') ? '' : 'AND shantytown_actors.fk_user IS NULL'}
                    ${shantytownFilter.includes('shantytownCreation') ? '' : 'AND shantytowns.updated_at - shantytowns.created_at > \'00:00:01\''}
                    ${shantytownFilter.includes('shantytownClosing') ? '' : 'AND shantytowns.closed_at IS NULL'}
                    ${shantytownFilter.includes('shantytownUpdate') ? '' : 'AND (shantytowns.closed_at IS NOT NULL OR shantytowns.updated_at - shantytowns.created_at <= \'00:00:01\')'}
                    ${maxDate ? ' AND shantytowns.updated_at >= :maxDate' : ''}
                    ORDER BY shantytowns.updated_at DESC
                    ${limit}
                )) activities
            LEFT JOIN users author ON activities.author_id = author.user_id
            WHERE activities.date < '${lastDate}'
            ORDER BY activities.date DESC
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
    activities.reverse().forEach((activity: any) => {
        if (!(listIdOldestVersions.includes(activity.id)) && (activity.date - activity.created_at > 10)) {
            listIdOldestVersions.push(activity.id);
        }
        listOldestVersions.push(`(${activity.id} , ${activity.hid})`);
    });
    // on récupère les précédentes versions des éléments de listIdOldestVersions afin de pouvoir appliquer getDiff
    const queryPreviousVersions = listIdOldestVersions.length === 0 ? [] : await sequelize.query(
        `
            SELECT
                shantytowns.updated_at AS "date",
                COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
            FROM
                "ShantytownHistories"  AS shantytowns
            LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
            LEFT JOIN users author ON COALESCE(shantytowns.updated_by, shantytowns.created_by) = author.user_id
            ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
            WHERE (shantytowns.shantytown_id, shantytowns.updated_at) IN
                (
                    SELECT sho.shantytown_id, MAX(sho.updated_at)
                    FROM "ShantytownHistories" sho
                    WHERE
                        sho.shantytown_id IN (${listIdOldestVersions})
                        AND (sho.shantytown_id, sho.hid) NOT IN (${listOldestVersions})
                        AND sho.updated_at < '${lastDate}'
                    GROUP BY shantytown_id
               )
            `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );

    const previousVersions = {};

    // eslint-disable-next-line array-callback-return
    queryPreviousVersions.map((activity: any) => {
        const serializedShantytown = serializeShantytown(activity, user);
        previousVersions[activity.id] = serializedShantytown;
    });

    return activities
        .map((activity: any) => {
            const o: any = {
                entity: 'shantytown',
                action: null,
                date: activity.date.getTime() / 1000,
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

            const previousVersion = previousVersions[activity.id] || null;
            const serializedShantytown = serializeShantytown(activity, user);
            previousVersions[activity.id] = serializedShantytown;

            if (previousVersion === null) {
                o.action = 'creation';
            } else if (previousVersion.closedAt === null && activity.closedAt !== null) {
                o.action = 'closing';
                o.shantytown.closedWithSolutions = activity.closedWithSolutions === 'yes';
            } else {
                o.action = 'update';
                // on utilise le nom du site dans la précédente version (au cas ou ce dernier aurait changé)
                o.shantytown.usename = getUsenameOf(previousVersion);

                const diff = getDiff(previousVersion, serializedShantytown);
                if (diff.length === 0) {
                    return null;
                }

                o.diff = diff;
            }
            return o;
        }).reverse()
        .filter(activity => activity !== null);
};
