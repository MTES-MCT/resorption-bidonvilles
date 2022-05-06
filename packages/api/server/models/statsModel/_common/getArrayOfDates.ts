import moment from 'moment';

function substractWeek(date) {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
}

export default (startDate, endDate) => {
    let currentDate = endDate;
    const listOfDates = [];
    while (currentDate > startDate) {
        listOfDates.push(moment(currentDate).format('YYYY-MM-DD HH:mm:ss ZZ'));
        currentDate = substractWeek(currentDate);
    }
    return listOfDates;
};
