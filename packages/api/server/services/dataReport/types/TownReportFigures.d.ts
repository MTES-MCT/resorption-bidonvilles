export type TownReportFigures = {
    number_of_towns: {
        all: number,
        overseas: number,
        eu_only: number,
        french_only: number,
        extra_eu_only: number,
        mixed_origins: number,
        unknown_origins: number
    },
    number_of_people: {
        all: number,
        overseas: number,
        origins_european: number,
        origins_french: number,
        origins_other: number,
        origins_mixed: number,
        origins_null: number,
        minors: number,
        minors_in_school: number
    }
};
