const sequelize = require('#db/sequelize');
const shantytownActorModel = require('#server/models/shantytownActorModel');
const planShantytownModel = require('#server/models/planShantytownModel');
const incomingTownsModel = require('#server/models/incomingTownsModel');
const stringifyWhereClause = require('#server/models/_common/stringifyWhereClause');
const { where: pWhere } = require('#server/utils/permission');
const getComments = require('./getComments');
const serializeShantytown = require('./serializeShantytown');
const getDiff = require('./getDiff');
const SQL = require('./SQL');

function getBaseSql(table, whereClause = null, order = null, additionalSQL = {}) {
    const tables = {
        shantytowns: table === 'regular' ? 'shantytowns' : 'ShantytownHistories',
        shantytown_origins: table === 'regular' ? 'shantytown_origins' : 'ShantytownOriginHistories',
        origin_foreign_key: table === 'regular' ? 'shantytown_id' : 'hid',
        shantytown_toilet_types: table === 'regular' ? 'shantytown_toilet_types' : 'shantytown_toilet_types_history',
        toilet_types_foreign_key: table === 'regular' ? 'shantytown_id' : 'hid',
        electricity_access_types: table === 'regular' ? 'electricity_access_types' : 'electricity_access_types_history',
        electricity_foreign_key: table === 'regular' ? 'shantytown_id' : 'hid',
    };

    const selection = {
        ...(additionalSQL.selection || {}),
        ...SQL.selection,
    };
    const joins = [
        ...(additionalSQL.joins || []),
        ...SQL.joins,
    ];

    return `
        WITH
            shantytown_computed_origins AS (SELECT
                s.${tables.origin_foreign_key} AS fk_shantytown,
                string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins
            FROM "${tables.shantytowns}" s
            LEFT JOIN "${tables.shantytown_origins}" so ON so.fk_shantytown = s.${tables.origin_foreign_key}
            LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
            GROUP BY s.${tables.origin_foreign_key}),

            electricity_access_types AS (SELECT
                s.${tables.electricity_foreign_key} AS fk_shantytown,
                array_remove(array_agg(eat.electricity_access_type::text), NULL) AS electricity_access_types
            FROM "${tables.shantytowns}" s
            LEFT JOIN "${tables.electricity_access_types}" eat ON eat.fk_shantytown = s.${tables.electricity_foreign_key}
            GROUP BY s.${tables.electricity_foreign_key}),

            shantytown_toilet_types AS (SELECT
                s.${tables.toilet_types_foreign_key} AS fk_shantytown,
                array_remove(array_agg(stt.toilet_type::text), NULL) AS toilet_types
            FROM "${tables.shantytowns}" s
            LEFT JOIN "${tables.shantytown_toilet_types}" stt ON stt.fk_shantytown = s.${tables.toilet_types_foreign_key}
            GROUP BY s.${tables.toilet_types_foreign_key})

        SELECT
            ${Object.keys(selection).map(key => `${key} AS "${selection[key]}"`).join(',')},
            sco.origins AS "socialOrigins",
            eat.electricity_access_types AS "electricityAccessTypes",
            stt.toilet_types AS "toiletTypes"
        FROM "${tables.shantytowns}" AS shantytowns
        ${joins.map(({ table: t, on }) => `LEFT JOIN ${t} ON ${on}`).join('\n')}
        LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.${tables.origin_foreign_key}
        LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.${tables.electricity_foreign_key}
        LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.${tables.toilet_types_foreign_key}
        ${whereClause !== null ? `WHERE ${whereClause}` : ''}
        ${order !== null ? `ORDER BY ${order}` : ''}
    `;
}

module.exports = async (where = [], order = ['departements.code ASC', 'cities.name ASC'], user, feature, includeChangelog = false, additionalSQL = {}, argReplacements = {}) => {
    const permissionsClauseGroup = pWhere().can(user).do(feature, 'shantytown');
    if (permissionsClauseGroup === null) {
        return [];
    }

    if (Object.keys(permissionsClauseGroup).length > 0) {
        where.push(permissionsClauseGroup);
    }

    const replacements = { ...argReplacements, userId: user.id };
    const whereClause = stringifyWhereClause('shantytowns', where, replacements);

    console.time('SQL-TOWNS');
    const towns = await sequelize.query(
        getBaseSql(
            'regular',
            where.length > 0 ? whereClause : null,
            order.join(', '),
            additionalSQL,
        ),
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );
    console.timeEnd('SQL-TOWNS');

    console.time('SERIALIZE-TOWNS');

    if (towns.length === 0) {
        return [];
    }
    const serializedTowns = towns.reduce(
        (object, town) => {
            /* eslint-disable no-param-reassign */
            object.hash[town.id] = serializeShantytown(town, user);
            object.ordered.push(object.hash[town.id]);
            /* eslint-enable no-param-reassign */
            return object;
        },
        {
            hash: {},
            ordered: [],
        },
    );
    console.timeEnd('SERIALIZE-TOWNS');

    console.time('SQL-CHANGELOG');

    const promises = [];
    if (includeChangelog === true) {
        promises.push(
            sequelize.query(
                getBaseSql(
                    'history',
                    where.length > 0 ? whereClause : null,
                    ['shantytowns.shantytown_id ASC', 'shantytowns."archivedAt" ASC'].join(', '),
                    additionalSQL,
                ),
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements,
                },
            ),
        );
    } else {
        promises.push(Promise.resolve(undefined));
    }
    console.timeEnd('SQL-CHANGELOG');

    console.time('SQL-COMMENTS');
    const comments = await getComments(user, Object.keys(serializedTowns.hash), false);
    console.timeEnd('SQL-COMMENTS');

    console.time('SQL-COVID-COMMENTS');
    const covidComments = await getComments(user, Object.keys(serializedTowns.hash), true);
    console.timeEnd('SQL-COVID-COMMENTS');

    console.time('SQL-CLOSING-SOLUTIONS');
    promises.push(
        sequelize.query(
            `SELECT
                shantytown_closing_solutions.fk_shantytown AS "shantytownId",
                closing_solutions.closing_solution_id AS "closingSolutionId",
                shantytown_closing_solutions.number_of_people_affected AS "peopleAffected",
                shantytown_closing_solutions.number_of_households_affected AS "householdsAffected",
                shantytown_closing_solutions.message AS "message"
            FROM shantytown_closing_solutions
            LEFT JOIN closing_solutions ON shantytown_closing_solutions.fk_closing_solution = closing_solutions.closing_solution_id
            WHERE shantytown_closing_solutions.fk_shantytown IN (:ids)`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { ids: Object.keys(serializedTowns.hash) },
            },
        ),
    );
    console.timeEnd('SQL-CLOSING-SOLUTIONS');

    console.time('SQL-ACTORS');

    promises.push(
        shantytownActorModel.findAll(
            Object.keys(serializedTowns.hash),
        ),
    );
    console.timeEnd('SQL-ACTORS');

    console.time('SQL-PLANS');
    promises.push(
        planShantytownModel.findAll(
            Object.keys(serializedTowns.hash),
        ),
    );
    console.timeEnd('SQL-PLANS');


    console.time('SQL-INCOMING-TOWNS');

    promises.push(
        incomingTownsModel.findAll(user, Object.keys(serializedTowns.hash)),
    );
    console.timeEnd('SQL-INCOMING-TOWNS');


    console.time('attente de la Promise');
    const [history, closingSolutions, actors, plans, incomingTowns] = await Promise.all(promises);
    console.timeEnd('attente de la Promise');

    console.time('SERIALIZE');

    if (history !== undefined && history.length > 0) {
        const serializedHistory = history.map(h => serializeShantytown(h, user));
        for (let i = 1, { id } = serializedHistory[0]; i <= serializedHistory.length; i += 1) {
            if (!serializedHistory[i] || id !== serializedHistory[i].id) {
                if (!serializedTowns.hash[id]) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                const diff = getDiff(serializedHistory[i - 1], serializedTowns.hash[id]);
                if (diff.length > 0) {
                    serializedTowns.hash[id].changelog.unshift({
                        author: serializedTowns.hash[id].updatedBy,
                        date: serializedTowns.hash[id].updatedAt,
                        diff,
                    });
                }

                if (serializedHistory[i]) {
                    ({ id } = serializedHistory[i]);
                }

                // eslint-disable-next-line no-continue
                continue;
            }

            const diff = getDiff(serializedHistory[i - 1], serializedHistory[i]);
            if (diff.length > 0) {
                serializedTowns.hash[id].changelog.unshift({
                    author: serializedHistory[i].updatedBy,
                    date: serializedHistory[i].updatedAt,
                    diff,
                });
            }
        }
    }


    // @todo: move the serialization of these entities to their own model component
    Object.keys(serializedTowns.hash).forEach((shantytownId) => {
        serializedTowns.hash[shantytownId].comments.regular = comments[shantytownId] || [];
        serializedTowns.hash[shantytownId].comments.covid = covidComments[shantytownId] || [];
    });

    if (closingSolutions !== undefined) {
        closingSolutions.forEach((closingSolution) => {
            serializedTowns.hash[closingSolution.shantytownId].closingSolutions.push({
                id: closingSolution.closingSolutionId,
                peopleAffected: closingSolution.peopleAffected,
                householdsAffected: closingSolution.householdsAffected,
                message: closingSolution.message,
            });
        });
    }

    actors.forEach((actor) => {
        serializedTowns.hash[actor.shantytownId].actors.push(
            shantytownActorModel.serializeActor(actor),
        );
    });

    plans.forEach((plan) => {
        serializedTowns.hash[plan.shantytown_id].plans.push(
            planShantytownModel.serializePlan(plan),
        );
    });

    incomingTowns.forEach((incomingTown) => {
        serializedTowns.hash[incomingTown.shantytownId].reinstallationIncomingTowns.push(incomingTown);
    });
    console.timeEnd('SERIALIZE');

    return serializedTowns.ordered;
};
