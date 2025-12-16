import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import shantytownActorModel from '#server/models/shantytownActorModel';
import geoUtils from '#server/utils/geo';
import permissionUtils from '#server/utils/permission';
import serializeShantytown from '#server/models/shantytownModel/_common/serializeShantytown';
import { ActorRow } from '#server/models/shantytownActorModel/ActorRow.d';
import serializeActor from '#server/models/shantytownActorModel/serializeActor';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import SQL, { ShantytownRow } from './_common/SQL';
import { ShantytownFilters } from '#root/types/resources/shantytownFilters.d';
import shantytownPreparatoryPhasesTowardResorptionModel from '../shantytownPreparatoryPhasesTowardResorptionModel';
import { ShantytownExportListOption } from '#root/types/resources/ShantytownExportTypes.d';

const { fromGeoLevelToTableName } = geoUtils;
const { restrict } = permissionUtils;

type ShantytownObject = { [key: number]: ShantytownRow };

async function applyStatusFilters(shantytownHistory: ShantytownRow[], statusFilter: string, user: AuthUser): Promise<ShantytownRow[]> {
    if (!statusFilter) {
        return shantytownHistory;
    }

    const statusFilters = {
        open: (towns: ShantytownRow[]) => towns.filter(el => el.status === 'open' && el.closedAt === null),
        inProgress: async (towns: ShantytownRow[]) => {
            const preparatoryPhases = await shantytownPreparatoryPhasesTowardResorptionModel.find(
                user,
                towns.map(row => String(row.id)),
            );
            return preparatoryPhases.length > 0
                ? towns.filter(el => el.status === 'open' && el.closedAt === null
                    && preparatoryPhases.some(phase => phase.townId === el.id))
                : [];
        },

        closed: (towns: ShantytownRow[]) => towns.filter(el => el.status !== 'open' && el.closedAt !== null),
        resorbed: (towns: ShantytownRow[]) => towns.filter(el => el.status !== 'open' && el.closedWithSolutions === 'yes' && el.closedAt !== null),
    };

    const filterFn = statusFilters[statusFilter];
    return filterFn ? filterFn(shantytownHistory) : shantytownHistory;
}

function applyPopulationFilters(shantytownHistory: ShantytownRow[], populationFilter: string): ShantytownRow[] {
    if (!populationFilter) {
        return shantytownHistory;
    }

    const conditions = decodeURIComponent(populationFilter).split(',');

    const populationCheckers = {
        unknown: (town: ShantytownRow) => town.populationTotal === null,
        '-9': (town: ShantytownRow) => town.populationTotal !== null && town.populationTotal < 10,
        '10-99': (town: ShantytownRow) => town.populationTotal !== null && town.populationTotal >= 10 && town.populationTotal <= 99,
        '100-': (town: ShantytownRow) => town.populationTotal !== null && town.populationTotal >= 100,
    };

    return shantytownHistory.filter(town => conditions.some(condition => populationCheckers[condition]?.(town) ?? false));
}

function applyFieldTypeFilters(shantytownHistory: ShantytownRow[], fieldTypeFilter: string): ShantytownRow[] {
    let filteredShantytownHistory = shantytownHistory;
    if (fieldTypeFilter) {
        const fieldTypeIds = new Set(fieldTypeFilter.split(',').map(Number));
        filteredShantytownHistory = filteredShantytownHistory.filter(town => fieldTypeIds.has(town.fieldTypeId));
    }
    return filteredShantytownHistory;
}

function applyOriginFilters(shantytownHistory: ShantytownRow[], originFilter: string): ShantytownRow[] {
    if (!originFilter) {
        return shantytownHistory;
    }

    const conditions = decodeURIComponent(originFilter).split(',');

    const originCheckers = {
        unknown: (town: ShantytownRow) => town.socialOrigins === null,
        1: (town: ShantytownRow) => town.socialOrigins?.some(origin => origin.startsWith('1|')) ?? false,
        2: (town: ShantytownRow) => town.socialOrigins?.some(origin => origin.startsWith('2|')) ?? false,
        3: (town: ShantytownRow) => town.socialOrigins?.some(origin => origin.startsWith('3|')) ?? false,
    };

    return shantytownHistory.filter(town => conditions.some(condition => originCheckers[condition]?.(town) ?? false));
}

function applyTargetFilters(shantytownHistory: ShantytownRow[], targetFilter: string): ShantytownRow[] {
    if (!targetFilter) {
        return shantytownHistory;
    }

    const targetCheckers = {
        yes: (town: ShantytownRow) => town.resorptionTarget !== null,
        no: (town: ShantytownRow) => town.resorptionTarget === null,
    };

    const checker = targetCheckers[targetFilter];
    return checker ? shantytownHistory.filter(checker) : shantytownHistory;
}

function checkJusticeCondition(town: ShantytownRow, condition: string): boolean {
    const checks = {
        unknown: () => town.justiceProcedure === null,
        none: () => town.justiceProcedure === false,
        justiceProcedure: () => town.justiceProcedure === true,
        ownerComplaint: () => town.ownerComplaint === true,
        justiceRendered: () => town.justiceRendered === true,
    };

    return checks[condition]?.() ?? false;
}

function applyJusticeFilters(shantytownHistory: ShantytownRow[], justiceFilter: string): ShantytownRow[] {
    if (!justiceFilter) {
        return shantytownHistory;
    }

    const conditions = decodeURIComponent(justiceFilter).split(',');
    return shantytownHistory.filter(town => conditions.some(condition => checkJusticeCondition(town, condition)));
}

function applyAdministrativeOrderFilters(shantytownHistory: ShantytownRow[], administrativeOrderFilter: string): ShantytownRow[] {
    const conditions = decodeURIComponent(administrativeOrderFilter).split(',');

    const conditionCheckers = {
        unknown: (town: ShantytownRow) => town.evacuationUnderTimeLimit === null,
        none: (town: ShantytownRow) => town.evacuationUnderTimeLimit === false,
        evacuationUnderTimeLimit: (town: ShantytownRow) => town.evacuationUnderTimeLimit === true,
    };

    return shantytownHistory.filter(town => conditions.some(condition => conditionCheckers[condition]?.(town) ?? false));
}

function checkRhiCondition(town: ShantytownRow, condition: string): boolean {
    const checks = {
        unknown: () => town.insalubrityOrder === null,
        none: () => town.insalubrityOrder === false,
        insalubrityOrder: () => town.insalubrityOrder === true,
    };

    return checks[condition]?.() ?? false;
}

function applyRhiFilters(shantytownHistory: ShantytownRow[], rhiFilter: string): ShantytownRow[] {
    if (!rhiFilter) {
        return shantytownHistory;
    }

    const conditions = decodeURIComponent(rhiFilter).split(',');
    return shantytownHistory.filter(town => conditions.some(condition => checkRhiCondition(town, condition)));
}

function checkHeatwaveCondition(town: ShantytownRow, condition: string): boolean {
    const checks = {
        no: () => town.heatwaveStatus === false,
        yes: () => town.heatwaveStatus === true,
    };

    return checks[condition]?.() ?? false;
}

function applyHeatwaveFilters(shantytownHistory: ShantytownRow[], heatwaveFilter: string): ShantytownRow[] {
    if (!heatwaveFilter) {
        return shantytownHistory;
    }

    const conditions = decodeURIComponent(heatwaveFilter).split(',');
    return shantytownHistory.filter(town => conditions.some(condition => checkHeatwaveCondition(town, condition)));
}

function applyClosureYearFilter(shantytownHistory: ShantytownRow[], closureYearFilter: string): ShantytownRow[] {
    if (!closureYearFilter) {
        return shantytownHistory;
    }

    const year = Number.parseInt(closureYearFilter, 10);
    if (Number.isNaN(year)) {
        return shantytownHistory;
    }

    return shantytownHistory.filter((town) => {
        if (!town.closedAt) {
            return false;
        }
        const closedAtDate = new Date(town.closedAt);
        return closedAtDate.getFullYear() === year;
    });
}

const functionsForFiltersArray = [
    {
        name: 'exportedSitesStatus',
        fn: applyStatusFilters,
    },
    {
        name: 'population',
        fn: applyPopulationFilters,
    },
    {
        name: 'fieldType',
        fn: applyFieldTypeFilters,
    },
    {
        name: 'origin',
        fn: applyOriginFilters,
    },
    {
        name: 'target',
        fn: applyTargetFilters,
    },
    {
        name: 'justice',
        fn: applyJusticeFilters,
    },
    {
        name: 'administrativeOrder',
        fn: applyAdministrativeOrderFilters,
    },
    {
        name: 'rhi',
        fn: applyRhiFilters,
    },
    {
        name: 'heatwave',
        fn: applyHeatwaveFilters,
    },
    {
        name: 'closureYear',
        fn: applyClosureYearFilter,
    },
];


async function applyFilters(shantytownHistory: ShantytownRow[], filters: ShantytownFilters, user: AuthUser): Promise<ShantytownRow[]> {
    // Utiliser reduce pour traiter séquentiellement les filtres
    const filteredShantytownHistory = await functionsForFiltersArray.reduce(
        async (accPromise, { name, fn }) => {
            const acc = await accPromise;
            if (filters[name]) {
                return fn(acc, filters[name], user);
            }
            return acc;
        },
        Promise.resolve(shantytownHistory),
    );

    return filteredShantytownHistory;
}

function getQueryString(where: string[]): string {
    return `
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
                        GROUP BY s.hid),

                        shantytown_resorption_phases AS (SELECT
                            s.hid AS fk_shantytown,
                            COALESCE(
                                NULLIF(
                                    array_agg(
                                        CASE 
                                            WHEN srp.fk_preparatory_phase IS NOT NULL THEN
                                                json_build_object(
                                                    'uid', pptr.uid,
                                                    'name', pptr.name,
                                                    'dateLabel', pptr.date_label,
                                                    'completedAt', srp.completed_at,
                                                    'createdAt', srp.created_at,
                                                    'isAStartingPhase', pptr.is_a_starting_phase
                                                )::jsonb
                                            ELSE NULL
                                        END
                                    ) FILTER (WHERE srp.fk_preparatory_phase IS NOT NULL),
                                    ARRAY[]::jsonb[]
                                ),
                                ARRAY[]::jsonb[]
                            ) AS resorption_phases
                        FROM "ShantytownHistories" s
                        LEFT JOIN shantytown_resorption_phases_history srp 
                            ON srp.fk_shantytown = s.hid
                            AND srp.archived_at = (
                                SELECT MIN(srph.archived_at) 
                                FROM shantytown_resorption_phases_history srph 
                                WHERE srph.fk_shantytown = s.hid 
                                AND srph.archived_at >= s.updated_at
                            )
                        LEFT JOIN preparatory_phases_toward_resorption pptr ON pptr.uid = srp.fk_preparatory_phase
                        GROUP BY s.hid)

                    SELECT
                        shantytowns.hid,
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        sco.origins AS "socialOrigins",
                        eat.electricity_access_types AS "electricityAccessTypes",
                        stt.toilet_types AS "toiletTypes",
                        srp.resorption_phases AS "preparatoryPhasesTowardResorption",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(',')}
                    FROM "ShantytownHistories" shantytowns
                    LEFT JOIN shantytowns AS s ON shantytowns.shantytown_id = s.shantytown_id
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.hid
                    LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.hid
                    LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.hid
                    LEFT JOIN shantytown_resorption_phases srp ON srp.fk_shantytown = shantytowns.hid
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
                        GROUP BY s.shantytown_id),

                        shantytown_resorption_phases AS (SELECT
                            s.shantytown_id AS fk_shantytown,
                            COALESCE(
                                NULLIF(
                                    array_agg(
                                        CASE 
                                            WHEN srp.fk_preparatory_phase IS NOT NULL THEN
                                                json_build_object(
                                                    'uid', pptr.uid,
                                                    'name', pptr.name,
                                                    'dateLabel', pptr.date_label,
                                                    'completedAt', srp.completed_at,
                                                    'createdAt', srp.created_at,
                                                    'isAStartingPhase', pptr.is_a_starting_phase
                                                )::jsonb
                                            ELSE NULL
                                        END
                                    ) FILTER (WHERE srp.fk_preparatory_phase IS NOT NULL),
                                    ARRAY[]::jsonb[]
                                ),
                                ARRAY[]::jsonb[]
                            ) AS resorption_phases
                        FROM shantytowns s
                        LEFT JOIN shantytown_preparatory_phases_toward_resorption srp 
                            ON srp.fk_shantytown = s.shantytown_id
                        LEFT JOIN preparatory_phases_toward_resorption pptr ON pptr.uid = srp.fk_preparatory_phase
                        GROUP BY s.shantytown_id)

                    SELECT
                        0 as hid,
                        shantytowns.closed_at,
                        shantytowns.created_at,
                        shantytowns.updated_at AS "date",
                        sco.origins AS "socialOrigins",
                        eat.electricity_access_types AS "electricityAccessTypes",
                        stt.toilet_types AS "toiletTypes",
                        srp.resorption_phases AS "preparatoryPhasesTowardResorption",
                        COALESCE(shantytowns.updated_by, shantytowns.created_by) AS author_id,
                        ${Object.keys(SQL.selection).map(key => `${key} AS "${SQL.selection[key]}"`).join(', ')}
                    FROM shantytowns
                    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.shantytown_id
                    LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = shantytowns.shantytown_id
                    LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = shantytowns.shantytown_id
                    LEFT JOIN shantytown_resorption_phases srp ON srp.fk_shantytown = shantytowns.shantytown_id
                    ${SQL.joins.map(({ table, on }) => `LEFT JOIN ${table} ON ${on}`).join('\n')}
                    ${where.length > 0 ? `WHERE (${where.join(') OR (')})` : ''}
                )) shantytown_history
                WHERE shantytown_history.date < :lastDate
            `;
}

async function getRows(queryString: string, replacements: { userId: number; lastDate: string }): Promise<ShantytownRow[]> {
    const rows: ShantytownRow[] = await sequelize.query(
        queryString,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
    return rows;
}

function serializeTownWithPhases(town: ShantytownRow, user: AuthUser): Shantytown {
    const preparatoryPhases = ((town as any).preparatoryPhasesTowardResorption || []).map((phase: any) => ({
        preparatoryPhaseId: phase.uid,
        preparatoryPhaseName: phase.name,
        preparatoryPhaseDateLabel: phase.dateLabel,
        completedAt: phase.completedAt ? new Date(phase.completedAt).getTime() / 1000 : null,
        createdAt: phase.createdAt ? new Date(phase.createdAt).getTime() / 1000 : null,
        isAStartingPhase: phase.isAStartingPhase,
        createdBy: null, // Information non disponible dans l'historique agrégé
    }));

    return serializeShantytown({
        ...town,
        preparatoryPhasesTowardResorption: preparatoryPhases,
    }, user);
}

async function loadActorsIntoShantytowns(shantytownHistory: ShantytownRow[], user: AuthUser): Promise<Shantytown[]> {
    const actorRows: ActorRow[] = await shantytownActorModel.findAll(shantytownHistory.map(row => row.id));

    const serializedTowns = shantytownHistory.map((town) => {
        const serializedTown = serializeTownWithPhases(town, user);
        const matchingElements = actorRows.filter(item => item.shantytownId === serializedTown.id).map(actor => serializeActor(actor));
        return {
            ...serializedTown,
            actors: matchingElements,
        };
    });
    return serializedTowns;
}

async function applyLivingConditionsFilters(serializedTowns: Shantytown[], livingConditionFilters: string) {
    const filterToCondition = {
        accessToSanitary: ['sanitary'],
        accessToWater: ['water'],
        accessToTrash: ['trash'],
        accessToElectricity: ['electricity'],
        vermin: ['vermin', 'pest_animals'],
        firePreventionMeasures: ['firePrevention', 'fire_prevention'],
    };

    const livingConditionsFilters = decodeURIComponent(livingConditionFilters).split(',');

    return serializedTowns.filter(town => livingConditionsFilters.some(filter => filterToCondition[filter].some(key => town.livingConditions[key]
            && ['bad', 'unknown'].includes(town.livingConditions[key].status.status))));
}


function applyActorsFilters(serializedTowns: Shantytown[], filters: ShantytownFilters) {
    let filteredTowns = serializedTowns;
    if (filters.actors === 'yes') {
        filteredTowns = serializedTowns.filter(town => town.actors.length > 0);
    }
    if (filters.actors === 'no') {
        filteredTowns = serializedTowns.filter(town => town.actors.length < 1 || town.actors === null);
    }
    return filteredTowns;
}

function getShantytownHistoryArray(rows: ShantytownRow[]): ShantytownRow[] {
    const acc: ShantytownObject = {};
    rows.forEach((row) => {
        if (!acc[row.id] || row.updatedAt > acc[row.id].updatedAt) {
            acc[row.id] = row;
        }
    });
    return Object.values(acc);
}

async function serializeTowns(shantytownHistory: ShantytownRow[], filters: ShantytownFilters, options: ShantytownExportListOption[], user: AuthUser): Promise<Shantytown[]> {
    let serializedTowns: Shantytown[];
    if (filters.actors || options.includes('actors')) {
        serializedTowns = await loadActorsIntoShantytowns(shantytownHistory, user);

        // Filtrer sur les intervenants
        if (filters.actors) {
            serializedTowns = applyActorsFilters(serializedTowns, filters);
        }
    } else {
        serializedTowns = shantytownHistory.map(town => serializeTownWithPhases(town, user));
    }

    return serializedTowns;
}

export default async function getHistoryAtGivenDate(user: AuthUser, options: ShantytownExportListOption[], locations: Location[], lastDate: string, filters: ShantytownFilters): Promise<Shantytown[]> {
    const where = [];
    const replacements: { userId: number; lastDate: string } = {
        userId: user.id,
        lastDate,
    };

    const restrictedLocations = locations.map(l => restrict(l).for(user).askingTo('list', 'shantytown')).flat();
    if (restrictedLocations.length === 0) {
        return [];
    }

    if (!restrictedLocations.some(l => l.type === 'nation')) {
        where.push(
            restrictedLocations.map((l, index) => {
                replacements[`shantytownLocationCode${index}`] = l[l.type].code;
                const arr = [`${fromGeoLevelToTableName(l.type)}.code = :shantytownLocationCode${index}`];
                if (l.type === 'city') {
                    arr.push(`${fromGeoLevelToTableName(l.type)}.fk_main = :shantytownLocationCode${index}`);
                }

                return arr;
            }).flat().join(' OR '),
        );
    }

    const queryString = getQueryString(where);

    const rows: ShantytownRow[] = await getRows(
        queryString,
        replacements,
    );

    let shantytownHistory = getShantytownHistoryArray(rows);

    // Appliquer les filtres
    shantytownHistory = await applyFilters(shantytownHistory, filters, user);

    // Charger les intervenants
    let serializedTowns: Shantytown[];
    serializedTowns = await serializeTowns(shantytownHistory, filters, options, user);

    // Filtrer sur les conditions de vie
    if (filters.conditions) {
        serializedTowns = await applyLivingConditionsFilters(serializedTowns, filters.conditions);
    }
    return serializedTowns;
}
