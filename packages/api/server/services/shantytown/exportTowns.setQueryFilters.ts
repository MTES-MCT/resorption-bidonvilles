import { Where, WhereClauseGroup, WhereClause } from '#server/models/_common/types/Where.d';
import { ShantytownFilters } from '#root/types/resources/shantytownFilters.d';

// Helper générique pour décoder et construire des clauses à partir d'un mapping
type ClauseMapping = Record<string, (index: number) => { key: string; clause: WhereClause }>;

function buildClausesFromConditions(
    filterValue: string | undefined,
    mapping: ClauseMapping,
): Where {
    if (!filterValue) {
        return [];
    }

    const conditions = decodeURIComponent(filterValue).split(',');
    const clauses: WhereClauseGroup = {};

    conditions.forEach((condition, index) => {
        const builder = mapping[condition];
        if (builder) {
            const { key, clause } = builder(index);
            clauses[key] = clause;
        }
    });

    return Object.keys(clauses).length > 0 ? [clauses] : [];
}

// Helper pour créer une clause simple
function createSimpleClause(query: string, value: any, operator?: string, not?: boolean): WhereClause {
    const clause: WhereClause = { query, value };
    if (operator) {
        clause.operator = operator;
    }
    if (not) {
        clause.not = not;
    }
    return clause;
}

function addStatusFilters(filters: ShantytownFilters): Where {
    const townsFilters: Where = [];

    // Sites ouverts ou en cours de résorption => status IN ('open')
    if (filters.exportedSitesStatus === 'open' || filters.exportedSitesStatus === 'inProgress') {
        townsFilters.push({
            status: {
                query: 'shantytowns.status',
                value: 'open',
            },
            closed_at: {
                query: 'shantytowns.closed_at',
                value: null,
            },
        });
    }

    // Les sites en cours de résorption sont filtrés après l'appel au modèle
    // car le champ preparatoryPhasesTowardResorption est initialisé lors de la sérialisation
    // après exécution de la requête - il ne s'agit pas d'une clause SQL

    if (filters.exportedSitesStatus === 'resorbed') {
        townsFilters.push(
            {
                status:
                {
                    query: 'shantytowns.status',
                    not: true,
                    value: 'open',
                },
            },
            {
                closed_with_solutions:
                {
                    query: 'shantytowns.closed_with_solutions',
                    value: 'yes',
                },
            },
            {
                closed_at:
                {
                    query: 'shantytowns.closed_at',
                    not: true,
                    value: null,
                },
            },
        );
    }

    if (filters.exportedSitesStatus === 'closed') {
        // Tous les sites fermés (fermés et résorbés) => status NOT IN ('open')
        townsFilters.push(
            {
                status:
                {
                    query: 'shantytowns.status',
                    not: true,
                    value: 'open',
                },
            },
            {
                closed_at:
                {
                    query: 'shantytowns.closed_at',
                    not: true,
                    value: null,
                },
            },
        );
    }
    return townsFilters;
}

function addPopulationFilter(filters: ShantytownFilters): Where {
    const mapping: ClauseMapping = {
        unknown: index => ({
            key: `pop_unknown_${index}`,
            clause: createSimpleClause('shantytowns.population_total', null),
        }),
        '-9': index => ({
            key: `pop_minus9_${index}`,
            clause: createSimpleClause('shantytowns.population_total', 10, '<'),
        }),
        '10-99': index => ({
            key: `pop_range_${index}`,
            clause: {
                andClauses: [
                    {
                        pop_gte: createSimpleClause('shantytowns.population_total', 10, '>='),
                    },
                    {
                        pop_lte: createSimpleClause('shantytowns.population_total', 99, '<='),
                    },
                ],
            },
        }),
        '100-': index => ({
            key: `pop_more100_${index}`,
            clause: createSimpleClause('shantytowns.population_total', 100, '>='),
        }),
    };

    return buildClausesFromConditions(filters.population, mapping);
}

function addFieldTypeFilter(filters: ShantytownFilters): Where {
    if (!filters.fieldType) {
        return [];
    }

    return [{
        fieldType: {
            query: 'field_types.field_type_id',
            operator: 'IN',
            value: filters.fieldType.split(',').map(Number),
        },
    }];
}


function addOriginFilter(filters: ShantytownFilters): Where {
    if (!filters.origin) {
        return [];
    }

    const conditions = decodeURIComponent(filters.origin).split(',');

    if (conditions.includes('0')) {
        return [{
            origin_europe_exclusive: {
                query: '1',
                operator: '= 1 AND array_length(sco.origins, 1) = 1 AND sco.origins[1] ILIKE',
                value: '2|%',
            },
        }];
    }

    const orConditions: string[] = [];

    conditions.forEach((condition) => {
        switch (condition) {
            case 'unknown':
                orConditions.push('(sco.origins IS NULL OR sco.origins = \'{}\' OR sco.origins = \'{NULL}\' OR array_length(array_remove(sco.origins, NULL), 1) IS NULL)');
                break;
            case '1':
                orConditions.push('EXISTS (SELECT 1 FROM unnest(sco.origins) AS origin_item WHERE origin_item ILIKE \'1|%\')');
                break;
            case '2':
                orConditions.push('EXISTS (SELECT 1 FROM unnest(sco.origins) AS origin_item WHERE origin_item ILIKE \'2|%\')');
                break;
            case '3':
                orConditions.push('EXISTS (SELECT 1 FROM unnest(sco.origins) AS origin_item WHERE origin_item ILIKE \'3|%\')');
                break;
            default:
                break;
        }
    });

    if (orConditions.length === 0) {
        return [];
    }

    return [{
        origin_cumulative: {
            query: `(${orConditions.join(' OR ')})`,
            operator: '',
            value: true,
        },
    }];
}

function addTargetFilter(filters: ShantytownFilters): Where {
    if (!filters.target) {
        return [];
    }

    const targetMapping: Record<string, WhereClauseGroup> = {
        yes: {
            resorption_target: createSimpleClause('shantytowns.resorption_target', null, undefined, true),
        },
        no: {
            resorption_target: createSimpleClause('shantytowns.resorption_target', null),
        },
    };

    return targetMapping[filters.target] ? [targetMapping[filters.target]] : [];
}

function addJusticeFilter(filters: ShantytownFilters): Where {
    const mapping: ClauseMapping = {
        unknown: index => ({
            key: `justice_unknown_${index}`,
            clause: createSimpleClause('shantytowns.justice_procedure', null),
        }),
        none: index => ({
            key: `justice_none_${index}`,
            clause: createSimpleClause('shantytowns.justice_procedure', false),
        }),
        justiceProcedure: index => ({
            key: `justice_procedure_${index}`,
            clause: createSimpleClause('shantytowns.justice_procedure', true),
        }),
        ownerComplaint: index => ({
            key: `justice_procedure_${index}`,
            clause: createSimpleClause('shantytowns.owner_complaint', true),
        }),
        justiceRendered: index => ({
            key: `justice_procedure_${index}`,
            clause: createSimpleClause('shantytowns.justice_rendered', true),
        }),
    };

    return buildClausesFromConditions(filters.justice, mapping);
}

function addAdministrativeOrderFilter(filters: ShantytownFilters): Where {
    const mapping: ClauseMapping = {
        unknown: index => ({
            key: `administrative_order_unknown_${index}`,
            clause: createSimpleClause('shantytowns.evacuation_under_time_limit', null),
        }),
        none: index => ({
            key: `administrative_order_none_${index}`,
            clause: createSimpleClause('shantytowns.evacuation_under_time_limit', false),
        }),
        evacuationUnderTimeLimit: index => ({
            key: `administrative_order_procedure_${index}`,
            clause: createSimpleClause('shantytowns.evacuation_under_time_limit', true),
        }),
    };

    return buildClausesFromConditions(filters.administrativeOrder, mapping);
}

function addRhiFilter(filters: ShantytownFilters): Where {
    const mapping: ClauseMapping = {
        unknown: index => ({
            key: `rhi_unknown_${index}`,
            clause: createSimpleClause('shantytowns.insalubrity_order', null),
        }),
        none: index => ({
            key: `rhi_none_${index}`,
            clause: createSimpleClause('shantytowns.insalubrity_order', false),
        }),
        insalubrityOrder: index => ({
            key: `rhi_procedure_${index}`,
            clause: createSimpleClause('shantytowns.insalubrity_order', true),
        }),
    };

    return buildClausesFromConditions(filters.rhi, mapping);
}

function addHeatwaveFilter(filters: ShantytownFilters): Where {
    const mapping: ClauseMapping = {
        no: index => ({
            key: `heatwave_none_${index}`,
            clause: createSimpleClause('shantytowns.heatwave_status', false),
        }),
        yes: index => ({
            key: `heatwave_procedure_${index}`,
            clause: createSimpleClause('shantytowns.heatwave_status', true),
        }),
    };

    return buildClausesFromConditions(filters.heatwave, mapping);
}

function addClosingReasonFilter(filters: ShantytownFilters): Where {
    const mapping: ClauseMapping = {
        resorbed: index => ({
            key: `gradual_resorption_${index}`,
            clause: createSimpleClause('shantytowns.status', 'resorbed'),
        }),
        closed_by_justice: index => ({
            key: `closed_by_justice_${index}`,
            clause: createSimpleClause('shantytowns.status', 'closed_by_justice'),
        }),
        closed_by_pref_admin: index => ({
            key: `closed_by_pref_admin_${index}`,
            clause: createSimpleClause('shantytowns.status', 'closed_by_pref_admin'),
        }),
        closed_by_city_admin: index => ({
            key: `closed_by_city_admin_${index}`,
            clause: createSimpleClause('shantytowns.status', 'closed_by_city_admin'),
        }),
        other: index => ({
            key: `closing_reason_other_${index}`,
            clause: createSimpleClause('shantytowns.status', 'other'),
        }),
        unknown: index => ({
            key: `closing_reason_unknown_${index}`,
            clause: createSimpleClause('shantytowns.status', 'unknown'),
        }),
    };

    return buildClausesFromConditions(filters.closingReason, mapping);
}

function addClosureYearFilter(filters: ShantytownFilters): Where {
    if (!filters.closureYear) {
        return [];
    }

    const year = parseInt(filters.closureYear, 10);
    if (Number.isNaN(year)) {
        return [];
    }

    return [{
        closure_year: {
            query: 'EXTRACT(YEAR FROM shantytowns.closed_at)::integer',
            operator: '=',
            value: year,
        },
    }];
}

export default function setQueryFilters(filters: ShantytownFilters): Where {
    const townsFilters: Where = [];

    const filterFunctions = [
        addStatusFilters,
        addPopulationFilter,
        addFieldTypeFilter,
        addOriginFilter,
        addTargetFilter,
        addJusticeFilter,
        addAdministrativeOrderFilter,
        addRhiFilter,
        addHeatwaveFilter,
        addClosingReasonFilter,
        addClosureYearFilter,
    ];

    filterFunctions.forEach((filterFn) => {
        townsFilters.push(...filterFn(filters));
    });

    return townsFilters;
}
