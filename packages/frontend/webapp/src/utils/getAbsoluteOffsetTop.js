// Renvoie la distance entre la bordure extérieure de l'élément passé en paramètre et le haut de la page
export default function getAbsoluteOffsetTop(element) {
    let distanceTotale = 0;

    // Parcours des parents de l'élément jusqu'à atteindre le haut de page
    while (element) {
        distanceTotale += element.offsetTop; // Ajout de la distance de l'élément actuel
        element = element.offsetParent; // Parent suivant
    }
    return distanceTotale;
}
