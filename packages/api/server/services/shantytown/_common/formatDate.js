const moment = require('moment');

module.exports = (date, format) => moment(date * 1000).utcOffset(2).locale('fr').format(format);
