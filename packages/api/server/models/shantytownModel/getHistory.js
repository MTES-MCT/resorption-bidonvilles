const { sequelize } = require('#db/models');
const { fromGeoLevelToTableName } = require('#server/utils/geo');
const userModel = require('#server/models/userModel')();
const updateWhereClauseForPermissions = require('#server/models/common/updateWhereClauseForPermissions');
const getUsenameOf = require('./_common/getUsenameOf');
const serializeShantytown = require('./_common/serializeShantytown');
const getDiff = require('./_common/getDiff');
const SQL = require('./_common/SQL');


module.exports = async (userLocation, permissions, location, locationType, locationCode, shantytownFilter, numberOfActivities, lastDate) => {
    // apply geographic level restrictions
    const where = [];
    const replacements = {};
    const limit = numberOfActivities !== '-1' ? `limit ${numberOfActivities}` : '';
    updateWhereClauseForPermissions({
        permissions,
        permission: 'shantytown.list',
        requestedLocation: location,
        userLocation,
        whereFn: (loc) => {
            if (!loc) {
                where.push('false');
                return;
            }

            if (loc.type === 'nation') {
                return;
            }

            where.push(`${fromGeoLevelToTableName(loc.type)}.code = :shantytownLocationCode`);
            replacements.shantytownLocationCode = loc[loc.type].code;
        },
    });

    const activities = await sequelize.query(
        `
            SELECT
                activities.*,
                author.first_name AS author_first_name,
                author.last_name AS author_last_name,
                author.fk_organization AS author_organization
            FROM
                ((
                    SELECT
                        shantytowns.hid,
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')}
                    FROM "ShantytownHistories" shantytowns
                    LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    WHERE s.shantytown_id IS NOT NULL /* filter out history of deleted shantytowns */
                    ${where.length > 0 ? `AND ((${where.join(') OR (')}))` : ''}
                )
                UNION
                (
                    SELECT
                        0 as hid,
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
                    FROM shantytowns
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                )) activities
            LEFT JOIN users author ON activities.author_id = author.user_id
            WHERE activities.date < '${lastDate}'
            ${locationType !== 'nation' ? `AND activities."${locationType}Code" = '${locationCode}'` : ''}
            ${shantytownFilter.includes('shantytownCreation') ? '' : 'AND activities.date - activities.created_at > \'00:00:01\''}
            ${shantytownFilter.includes('shantytownClosing') ? '' : 'AND activities.closed_at IS NULL'}
            ${shantytownFilter.includes('shantytownUpdate') ? '' : 'AND (activities.closed_at IS NOT NULL OR activities.date - activities.created_at < \'00:00:01\')'}
            ORDER BY activities.date DESC
            ${limit}
            `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );
    const listOldestVersions = [];
    const listIdOldestVersions = [];
    // on récupère pour chaque bidonville la plus vieille version existante qui n'est pas une création
    activities.reverse().forEach((activity) => {
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
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    const previousVersions = {};

    // eslint-disable-next-line array-callback-return
    queryPreviousVersions.map((activity) => {
        const serializedShantytown = serializeShantytown(activity, permissions);
        previousVersions[activity.id] = serializedShantytown;
    });

    return activities
        .map((activity) => {
            const o = {
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
                    city: {
                        code: activity.cityCode,
                        name: activity.cityName,
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
            const serializedShantytown = serializeShantytown(activity, permissions);
            previousVersions[activity.id] = serializedShantytown;

            if (previousVersion === null) {
                o.action = 'creation';
            } else if (previousVersion.closedAt === null && activity.closedAt !== null) {
                o.action = 'closing';
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
