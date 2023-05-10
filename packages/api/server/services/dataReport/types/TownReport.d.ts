import { TownReportFigures } from './TownReportFigures.d';

export type TownReportPopulationFigures = {
    all_ids: number[],
    all: number,
    european: number,
};

export type TownReport = {
    date: Date,
    all: TownReportFigures,
    big_towns_only: TownReportFigures,
    population_10_50: TownReportPopulationFigures,
    population_51_100: TownReportPopulationFigures,
    population_101_150: TownReportPopulationFigures,
    population_151_200: TownReportPopulationFigures,
    population_201_250: TownReportPopulationFigures,
    population_250_or_more: TownReportPopulationFigures
};
