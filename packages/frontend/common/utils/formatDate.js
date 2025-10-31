import { DAYS, MONTHS } from "./dateConstants.js";

/**
 * Formate un timestamp en utilisant le fuseau horaire UTC.
 * À utiliser pour les dates calendaires (dates de déclaration, dates d'installation, etc.)
 * où seul le jour compte, pas l'heure locale.
 * 
 * Pour les événements horodatés avec heure (commentaires, etc.), utiliser formatTimestamp.
 * 
 * @param {number} timestamp - Timestamp Unix (en secondes)
 * @param {string} format - Format de sortie (d/m/y)
 * @returns {string} Date formatée en UTC
 */
export default function formatDate(timestamp, format = "d/m/y") {
    const date = new Date(timestamp * 1000);
    return format
        .replace("d", `0${date.getUTCDate()}`.slice(-2))
        .replace("m", `0${date.getUTCMonth() + 1}`.slice(-2))
        .replace("y", date.getUTCFullYear())
        .replace("h", `0${date.getUTCHours()}`.slice(-2))
        .replace("i", `0${date.getUTCMinutes()}`.slice(-2))
        .replace("M", MONTHS[date.getUTCMonth()].long)
        .replace("B", MONTHS[date.getUTCMonth()].short)
        .replace("U", DAYS[date.getUTCDay()]);
}
