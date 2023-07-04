export default function (metrics, parametres) {
    return parametres.reduce((acc, parametre) => {
        return parametre.filterMetrics(acc);
    }, metrics);
}
