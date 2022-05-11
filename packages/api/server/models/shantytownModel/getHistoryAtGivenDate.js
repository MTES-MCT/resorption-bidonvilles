const sequelize = require('#db/sequelize');
const { fromGeoLevelToTableName } = require('#server/utils/geo');
const { restrict } = require('#server/utils/permission');
const serializeShantytown = require('#server/models/shantytownModel/_common/serializeShantytown');
const SQL = require('./_common/SQL');

module.exports = async (user, location, lastDate, closedTowns) => {
    const where = [];
    const replacements = {
    };

    const restrictedLocation = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocation === null) {
        return [];
    }

    if (restrictedLocation.type !== 'nation') {
        where.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.code = :shantytownLocationCode`);
        replacements.shantytownLocationCode = restrictedLocation[restrictedLocation.type].code;
    }
    const shantytown_history = await sequelize.query(
        `
        SELECT * FROM 
            (
            SELECT
                rank() OVER(PARTITION BY id ORDER BY date DESC),
                shantytown_history.*
            FROM
                ((
                    WITH
                        shantytown_computed_origins AS (SELECT
                            s.hid AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins
                        FROM "ShantytownHistories" s
                        LEFT JOIN "ShantytownOriginHistories" so ON so.fk_shantytown = s.hid
                        LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
                        GROUP BY s.hid)
                    SELECT
                        shantytowns.hid,
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        sco.origins AS "socialOrigins",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')}
                    FROM "ShantytownHistories" shantytowns
                    LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.hid
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE ((${where.join(') OR (')}))` : ''}
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
                        GROUP BY s.shantytown_id)
                    SELECT
                        0 as hid,
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        sco.origins AS "socialOrigins",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
                    FROM shantytowns
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.shantytown_id
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                )) shantytown_history
            WHERE shantytown_history.date < '${lastDate}'
            ORDER BY shantytown_history.date DESC
            ) ranked_shantytown_history
            WHERE rank = 1
            ${closedTowns === true ? 'AND closed_at is NOT NULL' : 'AND closed_at is NULL'}
            `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    return shantytown_history.map(town => serializeShantytown(town, user));
};
