import getLivingConditionsStatuses from './statuses/main';

import { LivingConditionsV2 } from '../LivingConditions.d';

export default (town): LivingConditionsV2 => {
    const livingConditions: LivingConditionsV2 = {
        version: town.livingConditionsVersion,
        electricity: {
            status: {
                status: 'unknown',
                positive: [],
                negative: [],
                unknown: [],
            },
            access: town.electricityAccess,
            access_types: town.electricityAccessTypes ?? [],
            access_is_unequal: town.electricityAccessIsUnequal,
        },
        water: {
            status: {
                status: 'unknown',
                positive: [],
                negative: [],
                unknown: [],
            },
            access_type: town.waterAccessType,
            access_type_details: town.waterAccessTypeDetails,
            access_is_public: town.waterAccessIsPublic,
            access_is_continuous: town.waterAccessIsContinuous,
            access_is_continuous_details: town.waterAccessIsContinuousDetails,
            access_is_local: town.waterAccessIsLocal,
            access_is_close: town.waterAccessIsClose,
            access_is_unequal: town.waterAccessIsUnequal,
            access_is_unequal_details: town.waterAccessIsUnequalDetails,
            access_has_stagnant_water: town.waterAccessHasStagnantWater,
            access_comments: town.waterAccessComments,
        },
        trash: {
            status: {
                status: 'unknown',
                positive: [],
                negative: [],
                unknown: [],
            },
            is_piling: town.trashIsPiling,
            evacuation_is_close: town.trashEvacuationIsClose,
            evacuation_is_safe: town.trashEvacuationIsSafe,
            evacuation_is_regular: town.trashEvacuationIsRegular,
            bulky_is_piling: town.trashBulkyIsPiling,
        },
        sanitary: {
            status: {
                status: 'unknown',
                positive: [],
                negative: [],
                unknown: [],
            },
            open_air_defecation: town.sanitaryAccessOpenAirDefecation,
            working_toilets: town.sanitaryAccessWorkingToilets,
            toilet_types: town.toiletTypes ?? [],
            toilets_are_inside: town.sanitaryAccessToiletsAreInside,
            toilets_are_lighted: town.sanitaryAccessToiletsAreLighted,
            hand_washing: town.sanitaryAccessHandWashing,
        },
        pest_animals: {
            status: {
                status: 'unknown',
                positive: [],
                negative: [],
                unknown: [],
            },
            presence: town.pestAnimals,
            details: town.pestAnimalsDetails,
        },
        fire_prevention: {
            status: {
                status: 'unknown',
                positive: [],
                negative: [],
                unknown: [],
            },
            diagnostic: town.firePrevention,
        },
    };

    const statuses = getLivingConditionsStatuses(town);
    Object.keys(statuses).forEach((key) => {
        livingConditions[key].status = statuses[key];
    });

    return livingConditions;
};
