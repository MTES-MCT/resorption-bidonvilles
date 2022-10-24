const { substractWeek } = require('#server/utils/date');


module.exports = (startDate, endDate) => {
    let currentDate = endDate;
    const listOfDates = [];
    while (currentDate > startDate) {
        listOfDates.push(currentDate);
        currentDate = substractWeek(currentDate);
    }
    return listOfDates;
};
