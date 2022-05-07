import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import shantytownActorModelFactory from '#server/models/shantytownActorModel';
import planShantytownModelFactory from '#server/models/planShantytownModel';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import permissionUtils from '#server/utils/permission';
import getComments from './getComments';
import serializeShantytown from './serializeShantytown';
import getDiff from './getDiff';
import SQL from './SQL';

const shantytownActorModel = shantytownActorModelFactory();
const planShantytownModel = planShantytownModelFactory();
const { where: pWhere } = permissionUtils;

function getBaseSql(table, whereClause = null, order = null) {
    const tables = {
        shantytowns: table === 'regular' ? 'shantytowns' : 'ShantytownHistories',
        shantytown_origins: table === 'regular' ? 'shantytown_origins' : 'ShantytownOriginHistories',
        origin_foreign_key: table === 'regular' ? 'shantytown_id' : 'hid',
    };

    return `
        WITH
            shantytown_computed_origins AS (SELECT
                s.${tables.origin_foreign_key} AS fk_shantytown,
                string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins
            FROM "${tables.shantytowns}" s
            LEFT JOIN "${tables.shantytown_origins}" so ON so.fk_shantytown = s.${tables.origin_foreign_key}
            LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
            GROUP BY s.${tables.origin_foreign_key})
        SELECT
            ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')},
            sco.origins AS "socialOrigins"
        FROM "${tables.shantytowns}" AS shantytowns
        ${SQL.joins.map(({ table: t, on }) => `LEFT JOIN ${t} ON ${on}`).join('\n')}
        LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.${tables.origin_foreign_key}
        ${whereClause !== null ? `WHERE ${whereClause}` : ''}
        ${order !== null ? `ORDER BY ${order}` : ''}
    `;
}

/* eslint-disable-next-line @typescript-eslint/default-param-last */
export default async (where = [], order = ['departements.code ASC', 'cities.name ASC'], user, feature, includeChangelog = false) => {
    const permissionsClauseGroup = pWhere().can(user).do(feature, 'shantytown');
    if (permissionsClauseGroup === null) {
        return [];
    }

    if (Object.keys(permissionsClauseGroup).length > 0) {
        where.push(permissionsClauseGroup);
    }

    const replacements = {};
    const whereClause = stringifyWhereClause('shantytowns', where, replacements);
    const towns = await sequelize.query(
        getBaseSql(
            'regular',
            where.length > 0 ? whereClause : null,
            order.join(', '),
        ),
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );

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

    const promises = [];
    if (includeChangelog === true) {
        promises.push(
            sequelize.query(
                getBaseSql(
                    'history',
                    where.length > 0 ? whereClause : null,
                    ['shantytowns.shantytown_id ASC', 'shantytowns."archivedAt" ASC'].join(', '),
                ),
                {
                    type: QueryTypes.SELECT,
                    replacements,
                },
            ),
        );
    } else {
        promises.push(Promise.resolve(undefined));
    }

    promises.push(getComments(user, Object.keys(serializedTowns.hash), false));
    promises.push(getComments(user, Object.keys(serializedTowns.hash), true));

    promises.push(
        sequelize.query(
            `SELECT
                shantytown_closing_solutions.fk_shantytown AS "shantytownId",
                closing_solutions.closing_solution_id AS "closingSolutionId",
                shantytown_closing_solutions.number_of_people_affected AS "peopleAffected",
                shantytown_closing_solutions.number_of_households_affected AS "householdsAffected"
            FROM shantytown_closing_solutions
            LEFT JOIN closing_solutions ON shantytown_closing_solutions.fk_closing_solution = closing_solutions.closing_solution_id
            WHERE shantytown_closing_solutions.fk_shantytown IN (:ids)`,
            {
                type: QueryTypes.SELECT,
                replacements: { ids: Object.keys(serializedTowns.hash) },
            },
        ),
    );

    promises.push(
        shantytownActorModel.findAll(
            Object.keys(serializedTowns.hash),
        ),
    );

    promises.push(
        planShantytownModel.findAll(
            Object.keys(serializedTowns.hash),
        ),
    );

    const [history, comments, covidComments, closingSolutions, actors, plans] = await Promise.all(promises);

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
        serializedTowns.hash[shantytownId].comments.regular = comments[shantytownId];
        serializedTowns.hash[shantytownId].comments.covid = covidComments[shantytownId];
    });

    if (closingSolutions !== undefined) {
        closingSolutions.forEach((closingSolution) => {
            serializedTowns.hash[closingSolution.shantytownId].closingSolutions.push({
                id: closingSolution.closingSolutionId,
                peopleAffected: closingSolution.peopleAffected,
                householdsAffected: closingSolution.householdsAffected,
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

    return serializedTowns.ordered;
};
