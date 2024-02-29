export default {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
        },
    },
    plugins: {
        tooltip: {
            mode: "index",
            position: "nearest",
            usePointStyle: true,
            intersect: true,
            itemSort: (a, b) => b.parsed.y - a.parsed.y,
            titleFont: {
                size: 14,
            },
            callbacks: {
                title: (tooltipItem) => {
                    return (
                        tooltipItem[0].label.charAt(0).toUpperCase() +
                        tooltipItem[0].label.slice(1)
                    );
                },
            },
        },
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
