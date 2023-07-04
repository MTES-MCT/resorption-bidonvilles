import moment from 'moment';

export default (listOfDates: Date[], argDate: Date): number => listOfDates.findIndex((date: Date) => moment(date).set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
}).isAfter(moment(argDate).set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
})) || moment(date).set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
}).isSame(moment(argDate).set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
})));
