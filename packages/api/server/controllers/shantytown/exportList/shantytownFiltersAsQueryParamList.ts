const all = {
    population: 'Nombre de personnes',
    fieldType: 'Type de sites',
    origin: 'Origines',
    target: 'Objectif résorption',
    justice: 'Justice',
    administrativeOrder: 'Ordre administratif',
    rhi: 'RHI',
};

const openOrInProgress = {
    conditions: 'Conditions de vie',
    actors: 'Intervenants',
    heatwave: 'Risque canicule',
};

const closeOrResobed = {
    resorbedOrClosed: 'Résorbé / fermé',
    closingReason: 'Cause de la fermeture',
};

export default {
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
};
