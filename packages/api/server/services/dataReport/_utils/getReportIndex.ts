import moment from 'moment';
import getMonthDiff from './getMonthDiff';

export default (argFrom: Date, argTo: Date, argDate: Date): number => {
    const from = moment(argFrom).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const to = moment(argTo).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const date = moment(argDate).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    if (date < from) {
        return -1;
    }

    // rappel :
    // on génère un rapport pour la date de début, la date de fin, et le 1er de chaque mois entre ces deux dates
    // si je donne le 10/01/2023 et le 10/03/2023, je génère un rapport pour le 10/01/2023, 01/02/2023, et 10/03/2023

    // si la date donnée correspond à la date de début, il s'agit forcément du premier "rapport"
    if (date.unix() === from.unix()) {
        return 0;
    }

    // si la date donnée correspond au même mois que la date de fin, il s'agit forcément du dernier "rapport"
    if ((date.month() === to.month() && date.year() === to.year()) || date.unix() > to.unix()) {
        return from.month() === to.month() && from.year() === to.year()
            ? 1
            : getMonthDiff(argFrom, argTo);
    }

    // si la date donnée correspond au 1er du mois il s'agit du rapport N
    // si la date donnée correspond à un autre jour du mois, il s'agit du rapport N + 1
    const N = getMonthDiff(argFrom, argDate);
    return date.date() === 1 ? N : N + 1;
};
