const moment = require('moment');
const { substractWeek } = require('#server/utils/date');


module.exports = (startDate, endDate) => {
    let currentDate = endDate;
    const listOfDates = [];
    while (currentDate > startDate) {
        listOfDates.push(moment(currentDate).format('YYYY-MM-DD HH:mm:ss ZZ'));
        currentDate = substractWeek(currentDate);
    }
    return listOfDates;
};
