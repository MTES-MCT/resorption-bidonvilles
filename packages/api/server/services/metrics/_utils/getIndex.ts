import moment from 'moment';

export default (listOfDates: Date[], argDate: Date): number => listOfDates.findIndex((date: Date) => moment(date).isAfter(argDate));
