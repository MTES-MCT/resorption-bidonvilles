import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import geoUtils from '#server/utils/geo';
import permissionUtils from '#server/utils/permission';
import serializeShantytown from '#server/models/shantytownModel/_common/serializeShantytown';
import SQL from './_common/SQL';

const { fromGeoLevelToTableName } = geoUtils;
const { restrict } = permissionUtils;

export default async (user, location, lastDate, closedTowns) => {
    const where = [];
    const replacements: any = {
        userId: user.id,
    };

    const restrictedLocation = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocation === null) {
        return [];
    }

    if (restrictedLocation.type !== 'nation') {
        where.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.code = :shantytownLocationCode`);
        replacements.shantytownLocationCode = restrictedLocation[restrictedLocation.type].code;
    }

    const rows:any = await sequelize.query(
        `
            SELECT
                shantytown_history.*
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
                            array_remove(array_agg(eat.electricity_access_type::text), NULL) AS electricity_access_types
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
                )) shantytown_history
            WHERE shantytown_history.date < '${lastDate}'  
            `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );


    const acc = {};
    rows.forEach((row) => {
        if (!acc[row.id] || row.updatedAt > acc[row.id].updatedAt) {
            acc[row.id] = row;
        }
        return {};
    });
    const shantytown_history = Object.values(acc).filter((el:any) => ((closedTowns && (el.closedAt !== null)) || (!closedTowns && (el.closedAt === null))));


    return shantytown_history.map(town => serializeShantytown(town, user));
};
