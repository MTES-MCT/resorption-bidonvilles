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
            onHover: function (e) {
                e.native.target.style.cursor = "pointer";
            },
            onClick: function (event, legendItem, legend) {
                const index = legendItem.datasetIndex;
                const ci = legend.chart;
                ci.toggleDataVisibility(index);

                if (ci.isDatasetVisible(index)) {
                    ci.hide(index);
                    legendItem.hidden = true;
                } else {
                    ci.show(index);
                    legendItem.hidden = false;
                }
            },
            labels: {
                boxWidth: 20,
            },
        },
    },
};
