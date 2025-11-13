import moment from 'moment';

/**
 * Formate un timestamp en utilisant UTC pour les exports Word.
 * Remplace l'ancien .utcOffset(2) qui forçait UTC+2.
 *
 * @param date - Timestamp Unix (en secondes)
 * @param format - Format moment.js (ex: 'DD/MM/YYYY')
 * @returns Date formatée en UTC
 */
export default (date, format) => moment(date * 1000).utc().locale('fr').format(format);
