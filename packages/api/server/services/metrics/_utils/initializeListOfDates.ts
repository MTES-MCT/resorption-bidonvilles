import moment from 'moment';
import getMonthDiff from '../../dataReport/_utils/getMonthDiff';
import getWeekDiff from './getWeekDiff';

export type DateObject = {
    date: Date;
    label: string;
};

// Si au moins 3 mois de différence entre argFrom et argTo, ajoute un label pour chaque mois, sinon, ajoute un label pour chaque semaine
export default (argFrom: Date, argTo: Date): DateObject[] => {
    const from = moment(argFrom).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const to = moment(argTo).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    let diff = getMonthDiff(argFrom, argTo);
    let step = 'months';
    let format = 'MMMM YYYY';


    if (diff < 3) {
        diff = getWeekDiff(argFrom, argTo);
        step = 'weeks';
        format = 'DD/MM/YYYY';
    }

    const listOfDates = [{ date: from.toDate(), label: from.format(format).charAt(0).toUpperCase() + from.format(format).slice(1) }];


    // there is a special case for when from and to are the exact same day
    if (from.unix() === to.unix()) {
        return listOfDates;
    }


    for (let i = 1, d = moment(from).add(1, step === 'weeks' ? 'weeks' : 'months'); i < (step === 'months' ? diff : (diff + 1)); i += 1, d.add(1, step === 'weeks' ? 'weeks' : 'months')) {
        if (!moment(to).isSame(d)) {
            listOfDates.push({ date: d.toDate(), label: d.format(format).charAt(0).toUpperCase() + d.format(format).slice(1) });
        }
    }

    listOfDates.push({ date: to.toDate(), label: moment(argTo).format(format).charAt(0).toUpperCase() + moment(argTo).format(format).slice(1) });

    return listOfDates;
};
