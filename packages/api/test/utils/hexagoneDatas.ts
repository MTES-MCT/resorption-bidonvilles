import { DepartementMetricsRawData } from '#root/types/resources/DepartementMetrics.d';
import { HexagoneMetrics } from '#root/types/resources/HexagoneMetrics.d';

const hexagoneDatas = (): HexagoneMetrics => ({
    summary: {
        number_of_towns: {
            all: 1,
            eu_only: 1,
            unknown_population: 0,
            out_of_date: 1,
        },
        number_of_persons: {
            all: 823,
            eu_only: 823,
        },
        number_of_households: 114,
        number_of_minors: 237,
        number_of_schooled_minors: 42,
        number_of_towns_with_water: 0,
        number_of_towns_with_electricity: 0,
        number_of_towns_with_trash_evacuation: 0,
        number_of_towns_with_fire_prevention: 0,
        number_of_towns_with_toilets: 0,
        number_of_towns_without_pest_animals: 0,
        number_of_towns_with_heatwave: 1,
        number_of_towns_with_owner_complaint: 0,
        number_of_towns_with_justice_procedure: 0,
        number_of_towns_with_police: 1,
    },
});

const hexagoneRawDatas: () => DepartementMetricsRawData[] = () => [{
    shantytown_id: Math.floor(Math.random() * 1000),
    name: `Site ${Math.random().toString(36).substring(7)}`,
    address: `${Math.floor(Math.random() * 100)} rue du test`,
    latitude: 48.8566 + (Math.random() - 0.5),
    longitude: 2.3522 + (Math.random() - 0.5),
    city_code: String(Math.floor(Math.random() * 95000) + 1000),
    city_name: `Ville ${Math.random().toString(36).substring(7)}`,
    city_latitude: 48.8566 + (Math.random() - 0.5),
    city_longitude: 2.3522 + (Math.random() - 0.5),
    population_total: 823,
    population_couples: 114,
    population_minors: 237,
    minors_in_school: 42,
    owner_complaint: false,
    justice_procedure: false,
    police_status: 'granted',
    field_type: 'private',
    origins: ['european'],
    out_of_date: true,
    waterAccessType: 'close',
    waterAccessIsPublic: true,
    waterAccessIsContinuous: true,
    waterAccessIsLocal: true,
    waterAccessIsClose: true,
    waterAccessIsUnequal: true,
    waterAccessHasStagnantWater: true,
    toiletTypes: ['latrines'],
    sanitaryAccessOpenAirDefecation: true,
    sanitaryAccessWorkingToilets: true,
    sanitaryAccessToiletsAreInside: true,
    sanitaryAccessToiletsAreLighted: true,
    sanitaryAccessHandWashing: true,
    electricityAccess: true,
    electricityAccessTypes: ['reseau_urbain'],
    electricityAccessIsUnequal: false,
    trashIsPiling: false,
    trashEvacuationIsClose: true,
    trashEvacuationIsSafe: true,
    trashEvacuationIsRegular: true,
    trashBulkyIsPiling: true,
    pestAnimals: true,
    firePrevention: true,
    heatwave_status: true,
}];

const livingConditionsStatuses = () => ({
    electricity: {
        status: 'unknown', positive: [], negative: [], unknown: [],
    },
    water: {
        status: 'unknown', positive: [], negative: [], unknown: [],
    },
    trash: {
        status: 'unknown', positive: [], negative: [], unknown: [],
    },
    sanitary: {
        status: 'unknown',
        positive: [],
        negative: [],
        unknown: [],
    },
    pest_animals: {
        status: 'unknown', positive: [], negative: [], unknown: [],
    },
    fire_prevention: {
        status: 'unknown', positive: [], negative: [], unknown: [],
    },
});

export { hexagoneDatas, hexagoneRawDatas, livingConditionsStatuses };
