import { TownReport } from '../types/TownReport.d';
import { TownReportFigures } from '../types/TownReportFigures.d';

function getEmptyTownFigures(): TownReportFigures {
    return {
        number_of_towns: {
            all: 0,
            overseas: 0,
            eu_only: 0,
            french_only: 0,
            extra_eu_only: 0,
            mixed_origins: 0,
            unknown_origins: 0,
        },
        number_of_people: {
            all: 0,
            overseas: 0,
            eu: 0,
            french: 0,
            extra_eu: 0,
            mixed_origins: 0,
            unknown_origins: 0,
            minors: 0,
            minors_in_school: 0,
        },
    };
}

function getEmptyTownReport(date: Date): TownReport {
    return {
        date: new Date(date),
        all: getEmptyTownFigures(),
        big_towns_only: getEmptyTownFigures(),
    };
}

export default (argFrom: Date, argTo: Date): TownReport[] => {
    const from = new Date(argFrom);
    from.setHours(0, 0, 0, 0);

    const to = new Date(argTo);
    to.setHours(0, 0, 0, 0);

    const monthDiff = (to.getMonth() - from.getMonth()) + ((to.getFullYear() - from.getFullYear()) * 12);

    // ensure dates are valid to avoid infinite loop below
    if (to < from) {
        return [];
    }

    // there is a special case for when from and to are the exact same day
    if (from.getTime() === to.getTime()) {
        return [getEmptyTownReport(from)];
    }

    // initialize reports for each dates between the two given boundaries
    const reports: TownReport[] = [
        getEmptyTownReport(from),
        getEmptyTownReport(to),
    ];

    for (let i = 1, d = new Date(from.getFullYear(), from.getMonth() + 1, 1); i < monthDiff; i += 1, d.setMonth(d.getMonth() + 1)) {
        reports.splice(reports.length - 1, 0, getEmptyTownReport(d));
    }

    return reports;
};
