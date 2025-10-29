const DAYS = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
];

const MONTHS = [
    { long: 'Janvier', short: 'jan.' },
    { long: 'Février', short: 'fév.' },
    { long: 'Mars', short: 'mars' },
    { long: 'Avril', short: 'avr.' },
    { long: 'Mai', short: 'mai' },
    { long: 'Juin', short: 'juin' },
    { long: 'Juillet', short: 'juil.' },
    { long: 'Août', short: 'août' },
    { long: 'Septembre', short: 'sep.' },
    { long: 'Octobre', short: 'oct.' },
    { long: 'Novembre', short: 'nov.' },
    { long: 'Décembre', short: 'déc.' },
];

/**
 * Formate un timestamp en utilisant le fuseau horaire LOCAL du serveur.
 * À utiliser pour les événements horodatés (commentaires, modifications, etc.)
 * où l'heure locale est importante.
 *
 * Note: Le serveur tourne en Europe/Paris (UTC+1/+2).
 * Pour les dates calendaires sans heure, utiliser formatDate.
 *
 * @param timestamp - Timestamp Unix (en secondes)
 * @param format - Format de sortie (d/m/y h:i)
 * @returns Date formatée dans le fuseau horaire local du serveur
 */
export default (timestamp: number, format = 'd/m/y') => {
    const date = new Date(timestamp * 1000);
    return format
        .replace('d', `0${date.getDate()}`.slice(-2))
        .replace('m', `0${date.getMonth() + 1}`.slice(-2))
        .replace('y', date.getFullYear().toString())
        .replace('h', `0${date.getHours()}`.slice(-2))
        .replace('i', `0${date.getMinutes()}`.slice(-2))
        .replace('M', MONTHS[date.getMonth()].long)
        .replace('B', MONTHS[date.getMonth()].short)
        .replace('U', DAYS[date.getDay()]);
};
