import dateUtils from '#server/utils/date';

const { substractWeek } = dateUtils;

export default (startDate, endDate) => {
    let currentDate = endDate;
    const listOfDates = [];
    while (currentDate > startDate) {
        listOfDates.push(currentDate);
        currentDate = substractWeek(currentDate);
    }
    return listOfDates;
};
