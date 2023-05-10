export type TownReportTerritoryFigures = {
    number_of_towns: {
        total: number,
        eu_only: number,
        extra_eu_only: number,
        mixed_origins: number,
        unknown_origins: number,
        french_only: number
    },
    number_of_people: {
        total: number,
        minors: number,
        origins_french: number,
        origins_french_minors: number,
        origins_european: number,
        origins_european_minors: number,
        origins_other: number,
        origins_other_minors: number,
        origins_mixed: number,
        origins_mixed_minors: number,
        origins_null: number,
        origins_null_minors: number,
    }
};

export type TownReportFigures = {
    all: TownReportTerritoryFigures,
    overseas: TownReportTerritoryFigures,
};
