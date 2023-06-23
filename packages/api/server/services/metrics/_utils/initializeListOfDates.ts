import moment from 'moment';
import getMonthDiff from '../../dataReport/_utils/getMonthDiff';


export default (argFrom: Date, argTo: Date): any[] => {
    const from = moment(argFrom).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const to = moment(argTo).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const monthDiff = getMonthDiff(argFrom, argTo);

    const listOfDates = [{ date: from.toDate(), label: from.format('MMMM') }];


    // there is a special case for when from and to are the exact same day
    if (from.unix() === to.unix()) {
        return listOfDates;
    }


    for (let i = 1, d = moment(from).date(1).add(1, 'months'); i < monthDiff; i += 1, d.add(1, 'months')) {
        listOfDates.push({ date: d.toDate(), label: d.format('MMMM') });
    }

    listOfDates.push({ date: to.toDate(), label: moment(argTo).format('MMMM') });


    return listOfDates;
};
