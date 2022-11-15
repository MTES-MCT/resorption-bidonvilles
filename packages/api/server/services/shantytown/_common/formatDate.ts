import moment from 'moment';

export default (date, format) => moment(date * 1000).utcOffset(2).locale('fr').format(format);
