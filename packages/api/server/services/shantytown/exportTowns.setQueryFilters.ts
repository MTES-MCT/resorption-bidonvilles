import { Where, WhereClauseGroup } from '#server/models/_common/types/Where';
import { ShantytownFilters } from '#root/types/resources/shantytownFilters.d';

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
    if (!filters.population) {
        return [];
    }

    const conditions = decodeURIComponent(filters.population).split(',');
    const populationClauses: WhereClauseGroup = {};

    // eslint-disable-next-line no-restricted-syntax
    conditions.forEach((condition, index) => {
        switch (condition) {
            case 'unknown':
                populationClauses[`pop_unknown_${index}`] = {
                    query: 'shantytowns.population_total',
                    value: null,
                };
                break;

            case '-9':
                populationClauses[`pop_minus9_${index}`] = {
                    query: 'shantytowns.population_total',
                    operator: '<',
                    value: 10,
                };
                break;

            case '10-99':
                populationClauses[`pop_range_${index}`] = {
                    // condition AND imbriquée
                    andClauses: [
                        {
                            pop_gte: {
                                query: 'shantytowns.population_total',
                                operator: '>=',
                                value: 10,
                            },
                        },
                        {
                            pop_lte: {
                                query: 'shantytowns.population_total',
                                operator: '<=',
                                value: 99,
                            },
                        },
                    ],
                };
                break;

            case '100-':
                populationClauses[`pop_more100_${index}`] = {
                    query: 'shantytowns.population_total',
                    operator: '>=',
                    value: 100,
                };
                break;

            default:
                break;
        }
    });

    if (Object.keys(populationClauses).length === 0) {
        return [];
    }

    return [populationClauses];
}

function addFieldTypeFilter(filters: ShantytownFilters): Where {
    if (!filters.fieldType) {
        return [];
    }

    const fieldTypeFilter: Where = [];
    fieldTypeFilter.push({
        fieldType:
        {
            query: 'field_types.field_type_id',
            operator: 'IN',
            value: filters.fieldType.split(',').map(Number),
        },
    });

    if (fieldTypeFilter.length === 0) {
        return [];
    }

    return fieldTypeFilter;
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

    // eslint-disable-next-line no-restricted-syntax
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
    // target=yes,no
    const townsFilters: Where = [];

    if (filters.target === 'yes') {
        townsFilters.push(
            {
                resorption_target:
                {
                    query: 'shantytowns.resorption_target',
                    not: true,
                    value: null,
                },
            },
        );
    }

    if (filters.target === 'no') {
        townsFilters.push(
            {
                resorption_target:
                {
                    query: 'shantytowns.resorption_target',
                    value: null,
                },
            },
        );
    }

    return townsFilters;
}

function addJusticeFilter(filters: ShantytownFilters): Where {
    if (!filters.justice) {
        return [];
    }

    const conditions = decodeURIComponent(filters.justice).split(',');
    const justiceClauses: WhereClauseGroup = {};

    // eslint-disable-next-line no-restricted-syntax
    conditions.forEach((condition, index) => {
        switch (condition) {
            case 'unknown':
                justiceClauses[`justice_unknown_${index}`] = {
                    query: 'shantytowns.justice_procedure',
                    value: null,
                };
                break;

            case 'none':
                justiceClauses[`justice_none_${index}`] = {
                    query: 'shantytowns.justice_procedure',
                    value: false,
                };
                break;

            case 'justiceProcedure':
                justiceClauses[`justice_procedure_${index}`] = {
                    query: 'shantytowns.justice_procedure',
                    value: true,
                };
                break;

            case 'ownerComplaint':
                justiceClauses[`justice_procedure_${index}`] = {
                    query: 'shantytowns.owner_complaint',
                    value: true,
                };
                break;

            case 'justiceRendered':
                justiceClauses[`justice_procedure_${index}`] = {
                    query: 'shantytowns.justice_rendered',
                    value: true,
                };

                break;

            default:
                break;
        }
    });

    if (Object.keys(justiceClauses).length === 0) {
        return [];
    }

    return [justiceClauses];
}

function addAdministrativeOrderFilter(filters: ShantytownFilters): Where {
    if (!filters.administrativeOrder) {
        return [];
    }

    const conditions = decodeURIComponent(filters.administrativeOrder).split(',');
    const administrativeOrderClauses: WhereClauseGroup = {};

    conditions.forEach((condition, index) => {
        switch (condition) {
            case 'unknown':
                administrativeOrderClauses[`administrative_order_unknown_${index}`] = {
                    query: 'shantytowns.evacuation_under_time_limit',
                    value: null,
                };
                break;

            case 'none':
                administrativeOrderClauses[`administrative_order_none_${index}`] = {
                    query: 'shantytowns.evacuation_under_time_limit',
                    value: false,
                };
                break;

            case 'evacuationUnderTimeLimit':
                administrativeOrderClauses[`administrative_order_procedure_${index}`] = {
                    query: 'shantytowns.evacuation_under_time_limit',
                    value: true,
                };
                break;

            default:
                break;
        }
    });

    if (Object.keys(administrativeOrderClauses).length === 0) {
        return [];
    }

    return [administrativeOrderClauses];
}

function addRhiFilter(filters: ShantytownFilters): Where {
    if (!filters.rhi) {
        return [];
    }

    const conditions = decodeURIComponent(filters.rhi).split(',');
    const rhiClauses: WhereClauseGroup = {};

    // eslint-disable-next-line no-restricted-syntax
    conditions.forEach((condition, index) => {
        switch (condition) {
            case 'unknown':
                rhiClauses[`rhi_unknown_${index}`] = {
                    query: 'shantytowns.insalubrity_order',
                    value: null,
                };
                break;

            case 'none':
                rhiClauses[`rhi_none_${index}`] = {
                    query: 'shantytowns.insalubrity_order',
                    value: false,
                };
                break;

            case 'insalubrityOrder':
                rhiClauses[`rhi_procedure_${index}`] = {
                    query: 'shantytowns.insalubrity_order',
                    value: true,
                };
                break;

            default:
                break;
        }
    });

    if (Object.keys(rhiClauses).length === 0) {
        return [];
    }

    return [rhiClauses];
}

function addHeatwaveFilter(filters: ShantytownFilters): Where {
    if (!filters.heatwave) {
        return [];
    }

    const conditions = decodeURIComponent(filters.heatwave).split(',');
    const heatwaveClauses: WhereClauseGroup = {};

    // eslint-disable-next-line no-restricted-syntax
    conditions.forEach((condition, index) => {
        switch (condition) {
            case 'no':
                heatwaveClauses[`heatwave_none_${index}`] = {
                    query: 'shantytowns.heatwave_status',
                    value: false,
                };
                break;

            case 'yes':
                heatwaveClauses[`heatwave_procedure_${index}`] = {
                    query: 'shantytowns.heatwave_status',
                    value: true,
                };
                break;

            default:
                break;
        }
    });

    if (Object.keys(heatwaveClauses).length === 0) {
        return [];
    }

    return [heatwaveClauses];
}

function addClosingReasonFilter(filters: ShantytownFilters): Where {
    if (!filters.closingReason) {
        return [];
    }

    const conditions = decodeURIComponent(filters.closingReason).split(',');
    const closingReasonClauses: WhereClauseGroup = {};

    // eslint-disable-next-line no-restricted-syntax
    conditions.forEach((condition, index) => {
        switch (condition) {
            case 'resorbed':
                closingReasonClauses[`gradual_resorption_${index}`] = {
                    query: 'shantytowns.status',
                    value: 'resorbed',
                };
                break;

            case 'closed_by_justice':
                closingReasonClauses[`closed_by_justice_${index}`] = {
                    query: 'shantytowns.status',
                    value: 'closed_by_justice',
                };
                break;

            case 'closed_by_pref_admin':
                closingReasonClauses[`closed_by_pref_admin_${index}`] = {
                    query: 'shantytowns.status',
                    value: 'closed_by_pref_admin',
                };
                break;

            case 'closed_by_city_admin':
                closingReasonClauses[`closed_by_city_admin_${index}`] = {
                    query: 'shantytowns.status',
                    value: 'closed_by_city_admin',
                };
                break;

            case 'other':
                closingReasonClauses[`closing_reason_other_${index}`] = {
                    query: 'shantytowns.status',
                    value: 'other',
                };
                break;

            case 'unknown':
                closingReasonClauses[`closing_reason_unknown_${index}`] = {
                    query: 'shantytowns.status',
                    value: 'unknown',
                };
                break;

            default:
                break;
        }
    });

    if (Object.keys(closingReasonClauses).length === 0) {
        return [];
    }

    return [closingReasonClauses];
}

export default (filters: ShantytownFilters): Where => {
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
    ];

    // eslint-disable-next-line no-restricted-syntax
    filterFunctions.forEach((filterFn) => {
        townsFilters.push(...filterFn(filters));
    });

    return townsFilters;
};
