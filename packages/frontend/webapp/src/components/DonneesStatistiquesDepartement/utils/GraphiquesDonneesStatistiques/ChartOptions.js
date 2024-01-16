export default {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
        },
    },
    plugins: {
        legend: {
            // Empêche le clic sur la légende pour masquer la courbe correspondante
            // Evite les problèmes d'affichage des dégradés quand une courbe est masquée
            onClick: function (event) {
                if (event.type === "legend-click") {
                    const dataset = event.target.dataset;
                    if (dataset) {
                        return false;
                    }
                }
            },
            labels: {
                boxWidth: 20,
            },
        },
    },
};
