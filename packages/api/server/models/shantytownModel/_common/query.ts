import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import shantytownActorModel from '#server/models/shantytownActorModel';
import actionModel from '#server/models/actionModel';
import incomingTownsModel from '#server/models/incomingTownsModel';
import shantytownPreparatoryPhasesTowardResorptionModel from '#server/models/ShantytownPreparatoryPhasesTowardResorptionModel';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import permissionUtils from '#server/utils/permission';
import { Where } from '#server/models/_common/types/Where';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownAction } from '#root/types/resources/Action.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import getComments from './getComments';
import serializeShantytown from './serializeShantytown';
import getDiff from './getDiff';
import SQL, { ShantytownRow } from './SQL';

const { where: pWhere } = permissionUtils;
type ShantytownClosingSolutionRow = {
    id: number,
    peopleAffected: number,
    householdsAffected: number,
    message: string,
    shantytownId?: number
};

type ShantytownObject = {
    hash: { [key: number] : Shantytown },
    ordered: Shantytown[],
};
function getBaseSql(table, whereClause = null, order = null, additionalSQL: any = {}) {
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
                string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.uid || '|' || soo.label), ','), ',') AS origins
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

export default async (
    user: AuthUser,
    feature: string,
    where: Where = [],
    order = ['departements.code ASC', 'cities.name ASC'],
    includeChangelog = false,
    additionalSQL = {},
    argReplacements = {},
): Promise<Shantytown[]> => {
    const permissionsClauseGroup = pWhere().can(user).do(feature, 'shantytown');
    if (permissionsClauseGroup === null) {
        return [];
    }

    if (Object.keys(permissionsClauseGroup).length > 0) {
        where.push(permissionsClauseGroup);
    }

    const replacements = { ...argReplacements, userId: user.id };
    const whereClause = stringifyWhereClause('shantytowns', where, replacements);

    const towns: ShantytownRow[] = await sequelize.query(
        getBaseSql(
            'regular',
            where.length > 0 ? whereClause : null,
            order.join(', '),
            additionalSQL,
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
        (object: ShantytownObject, town: ShantytownRow) => {
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

    let historyPromise: Promise<ShantytownRow[]>;
    if (includeChangelog === true) {
        historyPromise = sequelize.query(
            getBaseSql(
                'history',
                where.length > 0 ? whereClause : null,
                ['shantytowns.shantytown_id ASC', 'shantytowns."archivedAt" ASC'].join(', '),
                additionalSQL,
            ),
            {
                type: QueryTypes.SELECT,
                replacements,
            },
        );
    } else {
        historyPromise = Promise.resolve(undefined);
    }


    const commentsPromise = getComments(user, Object.keys(serializedTowns.hash));

    const closingSolutionsPromise: Promise<ShantytownClosingSolutionRow[]> = sequelize.query(
        `SELECT
                shantytown_closing_solutions.fk_shantytown AS "shantytownId",
                closing_solutions.closing_solution_id AS "id",
                shantytown_closing_solutions.number_of_people_affected AS "peopleAffected",
                shantytown_closing_solutions.number_of_households_affected AS "householdsAffected",
                shantytown_closing_solutions.message AS "message"
            FROM shantytown_closing_solutions
            LEFT JOIN closing_solutions ON shantytown_closing_solutions.fk_closing_solution = closing_solutions.closing_solution_id
            WHERE shantytown_closing_solutions.fk_shantytown IN (:ids)`,
        {
            type: QueryTypes.SELECT,
            replacements: { ids: Object.keys(serializedTowns.hash) },
        },
    );
    const actorsPromise = shantytownActorModel.findAll(
        Object.keys(serializedTowns.hash),
    );

    const actionsPromise = actionModel.fetchByShantytown(
        user,
        Object.keys(serializedTowns.hash).map(id => parseInt(id, 10)),
    );

    const incomingTownsPromise = incomingTownsModel.findAll(user, Object.keys(serializedTowns.hash));

    const townsPhasesTowardResorptionPromise = shantytownPreparatoryPhasesTowardResorptionModel.find(user, Object.keys(serializedTowns.hash));

    const [history, comments, closingSolutions, actors, actions, incomingTowns, townsPhasesTowardResorption] = await Promise.all([historyPromise, commentsPromise, closingSolutionsPromise, actorsPromise, actionsPromise, incomingTownsPromise, townsPhasesTowardResorptionPromise]);

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
        serializedTowns.hash[shantytownId].comments = comments[shantytownId] || [];
    });

    if (closingSolutions !== undefined) {
        closingSolutions.forEach((closingSolution) => {
            serializedTowns.hash[closingSolution.shantytownId].closingSolutions.push({
                id: closingSolution.id,
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

    actions.forEach((action: ShantytownAction) => {
        action.shantytowns.forEach((shantytownId) => {
            if (serializedTowns.hash[shantytownId]?.actions === undefined) {
                return;
            }

            serializedTowns.hash[shantytownId].actions.push(action);
        });
    });

    incomingTowns.forEach((incomingTown) => {
        serializedTowns.hash[incomingTown.shantytownId].reinstallationIncomingTowns.push(incomingTown);
    });

    townsPhasesTowardResorption.forEach((elt) => {
        if (elt.preparatoryPhases.length > 0) {
            serializedTowns.hash[elt.townId].preparatoryPhasesTowardResorption = [];
            elt.preparatoryPhases.forEach((prepElt) => {
                serializedTowns.hash[elt.townId].preparatoryPhasesTowardResorption.push(prepElt);
            });
        }
    });
    return serializedTowns.ordered;
};
