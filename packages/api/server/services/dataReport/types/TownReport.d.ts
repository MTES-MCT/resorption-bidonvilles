import { TownReportFigures } from './TownReportFigures.d';

export type TownReport = {
    date: Date,
    all: TownReportFigures,
    big_towns_only: TownReportFigures
};
