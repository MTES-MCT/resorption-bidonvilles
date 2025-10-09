type FilterLabel = string;

type FilterMap = Record<string, FilterLabel>;

type SiteStatus = 'open' | 'inProgress' | 'closed' | 'resorbed';

type ShantytownFiltersAsQueryParamList = Record<SiteStatus, FilterMap>;

const all: FilterMap = {
    population: 'Nombre de personnes',
    fieldType: 'Type de sites',
    origin: 'Origines',
    target: 'Objectif résorption',
    justice: 'Justice',
    administrativeOrder: 'Ordre administratif',
    rhi: 'RHI',
} as const;

const openOrInProgress: FilterMap = {
    conditions: 'Conditions de vie',
    actors: 'Intervenants',
    heatwave: 'Risque canicule',
} as const;

const closeOrResobed: FilterMap = {
    resorbedOrClosed: 'Résorbé / fermé',
    closingReason: 'Cause de la fermeture',
} as const;

const shantytownFiltersAsQueryParamList: ShantytownFiltersAsQueryParamList = {
    open: {
        ...all,
        ...openOrInProgress,
    },
    inProgress: {
        ...all,
        ...openOrInProgress,
    },
    closed: {
        ...all,
        ...closeOrResobed,
    },
    resorbed: {
        ...all,
        ...closeOrResobed,
    },
};

export default shantytownFiltersAsQueryParamList;
