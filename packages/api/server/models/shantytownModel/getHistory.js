const { sequelize } = require('#db/models');
const { fromGeoLevelToTableName } = require('#server/utils/geo');
const userModel = require('#server/models/userModel')();
const getUsenameOf = require('./_common/getUsenameOf');
const serializeShantytown = require('./_common/serializeShantytown');
const getDiff = require('./_common/getDiff');
const SQL = require('./_common/SQL');
const { restrict } = require('#server/utils/permission');

module.exports = async (user, location) => {
    // apply geographic level restrictions
    const where = [];
    const replacements = {};

    const restrictedLocation = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocation === null) {
        return [];
    }

    if (restrictedLocation.type !== 'nation') {
        where.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.code = :shantytownLocationCode`);
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
                    SELECT
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
                        shantytowns.updated_at AS "date",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
                    FROM shantytowns
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                )) activities
            LEFT JOIN users author ON activities.author_id = author.user_id
            ORDER BY activities.date ASC
            `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    const previousVersions = {};

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
            const serializedShantytown = serializeShantytown(activity, user);
            previousVersions[activity.id] = serializedShantytown;

            if (previousVersion === null) {
                o.action = 'creation';
            } else if (previousVersion.closedAt === null && activity.closedAt !== null) {
                o.action = 'closing';
            } else {
                o.action = 'update';

                // on utilise le nom du site dans la précédente version (au cas om ce dernier aurait changé)
                o.shantytown.usename = getUsenameOf(previousVersion);

                const diff = getDiff(previousVersion, serializedShantytown);
                if (diff.length === 0) {
                    return null;
                }

                o.diff = diff;
            }

            return o;
        })
        .filter(activity => activity !== null)
        .reverse();
};
