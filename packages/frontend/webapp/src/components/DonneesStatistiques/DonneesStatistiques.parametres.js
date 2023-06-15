export default [
    {
        id: "regions",
        label: "Afficher les regions",
        filterMetrics: function (metrics) {
            return metrics;
        },
    },
    {
        id: "departements_less_than_50",
        label: "Masquer les départements avec moins de 50 habitants en bindonville",
        filterMetrics: function (metrics) {
            return metrics.map((metric) => {
                const nationCopyMetric = { ...metric };
                const filteredChildren = [];
                metric.children.forEach((child) => {
                    const regionCopyMetric = { ...child };
                    regionCopyMetric.children =
                        regionCopyMetric.children.filter(
                            (departementChild) =>
                                departementChild.metrics.number_of_persons.to >=
                                50
                        );
                    filteredChildren.push(regionCopyMetric);
                });
                nationCopyMetric.children = filteredChildren;
                return nationCopyMetric;
            });
        },
    },
    {
        id: "departements_without_town",
        label: "Masquer les départements sans sites",
        filterMetrics: function (metrics) {
            return metrics;
        },
    },
];
