import { TownReportFigures } from './TownReportFigures.d';

export type TownReportPopulationFigures = {
    all_ids: number[],
    all: number,
    european: number,
};

export type TownReportFiguresByPopulation = {
    metropolitan: TownReportPopulationFigures,
    overseas: TownReportPopulationFigures,
};

export type TownReport = {
    date: Date,
    all_sizes: TownReportFigures,
    big_towns_only: TownReportFigures,
    population_10_50: TownReportFiguresByPopulation,
    population_51_100: TownReportFiguresByPopulation,
    population_101_150: TownReportFiguresByPopulation,
    population_151_200: TownReportFiguresByPopulation,
    population_201_250: TownReportFiguresByPopulation,
    population_251_or_more: TownReportFiguresByPopulation
};
