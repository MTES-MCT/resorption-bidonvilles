import moment from 'moment';
import { TownReport, TownReportPopulationFigures } from '../types/TownReport.d';
import { TownReportFigures } from '../types/TownReportFigures.d';
import getMonthDiff from './getMonthDiff';

function getEmptyTownFigures(): TownReportFigures {
    return {
        all: {
            number_of_towns: {
                total: 0,
                eu_only: 0,
                extra_eu_only: 0,
                mixed_origins: 0,
                unknown_origins: 0,
                french_only: 0,
            },
            number_of_people: {
                total: 0,
                minors: 0,
                origins_french: 0,
                origins_french_minors: 0,
                origins_european: 0,
                origins_european_minors: 0,
                origins_other: 0,
                origins_other_minors: 0,
                origins_mixed: 0,
                origins_mixed_minors: 0,
                origins_null: 0,
                origins_null_minors: 0,
            },
        },
        overseas: {
            number_of_towns: {
                total: 0,
                eu_only: 0,
                extra_eu_only: 0,
                mixed_origins: 0,
                unknown_origins: 0,
                french_only: 0,
            },
            number_of_people: {
                total: 0,
                minors: 0,
                origins_french: 0,
                origins_french_minors: 0,
                origins_european: 0,
                origins_european_minors: 0,
                origins_other: 0,
                origins_other_minors: 0,
                origins_mixed: 0,
                origins_mixed_minors: 0,
                origins_null: 0,
                origins_null_minors: 0,
            },
        },
    };
}

function getEmptyPopulationFigures(): TownReportPopulationFigures {
    return {
        all_ids: [],
        all: 0,
        european: 0,
    };
}

function getEmptyTownReport(date: Date): TownReport {
    return {
        date: new Date(date),
        all: getEmptyTownFigures(),
        big_towns_only: getEmptyTownFigures(),
        population_10_50: getEmptyPopulationFigures(),
        population_51_100: getEmptyPopulationFigures(),
        population_101_150: getEmptyPopulationFigures(),
        population_151_200: getEmptyPopulationFigures(),
        population_201_250: getEmptyPopulationFigures(),
        population_250_or_more: getEmptyPopulationFigures(),
    };
}

export default (argFrom: Date, argTo: Date): TownReport[] => {
    const from = moment(argFrom).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const to = moment(argTo).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const monthDiff = getMonthDiff(argFrom, argTo);

    // ensure dates are valid to avoid infinite loop below
    if (to < from) {
        return [];
    }

    // there is a special case for when from and to are the exact same day
    if (from.unix() === to.unix()) {
        return [getEmptyTownReport(from.toDate())];
    }

    // initialize reports for each dates between the two given boundaries
    const reports: TownReport[] = [
        getEmptyTownReport(from.toDate()),
        getEmptyTownReport(to.toDate()),
    ];

    for (let i = 1, d = moment(from).date(1).add(1, 'months'); i < monthDiff; i += 1, d.add(1, 'months')) {
        reports.splice(reports.length - 1, 0, getEmptyTownReport(d.toDate()));
    }

    return reports;
};
