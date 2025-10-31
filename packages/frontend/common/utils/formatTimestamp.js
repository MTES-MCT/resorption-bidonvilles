import { DAYS, MONTHS } from "./dateConstants.js";

/**
 * Formate un timestamp en utilisant le fuseau horaire LOCAL de l'utilisateur.
 * À utiliser pour les événements horodatés (commentaires, modifications, etc.)
 * où l'heure locale est importante.
 * 
 * @param {number} timestamp - Timestamp Unix (en secondes)
 * @param {string} format - Format de sortie (d/m/y h:i)
 * @returns {string} Date formatée dans le fuseau horaire local
 */
export default function formatTimestamp(timestamp, format = "d/m/y") {
    const date = new Date(timestamp * 1000);
    return format
        .replace("d", `0${date.getDate()}`.slice(-2))
        .replace("m", `0${date.getMonth() + 1}`.slice(-2))
        .replace("y", date.getFullYear())
        .replace("h", `0${date.getHours()}`.slice(-2))
        .replace("i", `0${date.getMinutes()}`.slice(-2))
        .replace("M", MONTHS[date.getMonth()].long)
        .replace("B", MONTHS[date.getMonth()].short)
        .replace("U", DAYS[date.getDay()]);
}
