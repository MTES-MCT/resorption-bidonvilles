type Status = {
    status: 'good' | 'bad' | 'toImprove' | 'unknown'
    positive: string[],
    negative: string[],
    unknown: string[]
};

export type LivingConditionsV1 = {
    version: 1,
    electricity: {
        status: Status,
        type: {
            id: number,
            label: string,
        },
        comments: string | null,
    },
    water: {
        status: Status,
        access: boolean | null,
        comments: string | null,
        potable: boolean | null,
        continuousAccess: boolean | null,
        publicPoint: boolean | null,
        distance: string | null,
        roadsToCross: boolean | null,
        everyoneHasAccess: boolean | null,
        stagnantWater: boolean | null,
        handWashAccess: boolean | null,
        handWashAccessNumber: number | null,
    },
    trash: {
        status: Status,
        evacuation: boolean | null,
        cansOnSite: number | null,
        accumulation: boolean | null,
        evacuationRegular: boolean | null,
    },
    sanitary: {
        status: Status,
        access: boolean | null,
        comments: string | null,
        number: number | null,
        insalubrious: boolean | null,
        onSite: boolean | null,
    },
    vermin: {
        status: Status,
        vermin: boolean | null,
        comments: string | null,
    },
    firePrevention: {
        status: Status,
        measures: boolean | null,
        diagnostic: boolean | null,
        siteAccessible: boolean | null,
        devices: boolean | null,
        comments: string | null,
    },
};

export type LivingConditionsV2 = {
    version: 2,
    electricity: {
        status: Status,
        access: boolean | null,
        access_types: string[],
        access_is_unequal: boolean | null,
    },
    water: {
        status: Status,
        access_type: string | null,
        access_type_details: string | null,
        access_is_public: boolean | null,
        access_is_continuous: boolean | null,
        access_is_continuous_details: string | null,
        access_is_local: boolean | null,
        access_is_close: boolean | null,
        access_is_unequal: boolean | null,
        access_is_unequal_details: string | null,
        access_has_stagnant_water: boolean | null,
        access_comments: string | null,
    },
    trash: {
        status: Status,
        is_piling: boolean | null,
        evacuation_is_close: boolean | null,
        evacuation_is_safe: boolean | null,
        evacuation_is_regular: boolean | null,
        bulky_is_piling: boolean | null,
    },
    sanitary: {
        status: Status,
        open_air_defecation: boolean | null,
        working_toilets: boolean | null,
        toilet_types: string[],
        toilets_are_inside: boolean | null,
        toilets_are_lighted: boolean | null,
        hand_washing: boolean | null,
    },
    pest_animals: {
        status: Status,
        presence: boolean | null,
        details: string | null,
    },
    fire_prevention: {
        status: Status,
        diagnostic: boolean | null,
    },
};
