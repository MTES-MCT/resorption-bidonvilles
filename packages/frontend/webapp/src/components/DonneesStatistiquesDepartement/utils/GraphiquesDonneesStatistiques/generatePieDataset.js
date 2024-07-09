export default function generatePieDataset(
    label,
    colors,
    data,
    seriesnames,
    options = {}
) {
    let dataset = [];
    for (let i = 0; i < data.length; i++) {
        dataset.push({
            value: parseInt(data[i]),
            name:
                seriesnames[i].charAt(0).toUpperCase() +
                seriesnames[i].slice(1),
        });
    }
    return {
        type: "pie",
        name: label.charAt(0).toUpperCase() + label.slice(1),
        radius: "90%",
        left: "-20%",
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                borderColor: "transparent",
            },
        },
        data: dataset,
        itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
        },
        label: {
            show: true,
            position: "inside",
            formatter: "{c}",
            color: "#fff",
        },
        ...options,
    };
}
