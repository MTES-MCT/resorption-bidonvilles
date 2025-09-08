export type HexagoneMetrics = {
    summary: {
        number_of_towns: {
            all: number,
            eu_only: number,
            unknown_population: number,
            out_of_date: number
        },
        number_of_persons: {
            all: number,
            eu_only: number
        },
        number_of_households: number,
        number_of_minors: number,
        number_of_schooled_minors: number,
        number_of_towns_with_water: number,
        number_of_towns_with_electricity: number,
        number_of_towns_with_trash_evacuation: number,
        number_of_towns_with_fire_prevention: number,
        number_of_towns_with_toilets: number,
        number_of_towns_without_pest_animals: number,
        number_of_towns_with_heatwave: number,
        number_of_towns_with_owner_complaint: number,
        number_of_towns_with_justice_procedure: number,
        number_of_towns_with_police: number
    } };
