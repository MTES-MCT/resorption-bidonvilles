export default function generateDataset(label, color, data, options = {}) {
    if (options?.area) {
        options = {
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: `rgba(${color}, .5)`,
                        },
                        {
                            offset: 1,
                            color: `rgba(${color}, 0)`,
                        },
                    ],
                    global: false,
                },
            },
            ...options,
        };
    }
    return {
        type: "line",
        name: label,
        symbol: "circle",
        symbolSize: 5,
        emphasis: {
            disabled: false,
            focus: "none",
            scale: 10,
            itemStyle: {
                color: `rgba(${color}, 1)`,
                borderColor: "rgba(70, 249, 60, 1)",
            },
        },
        data: data,
        lineStyle: {
            color: `rgba(${color}, .5)`,
        },
        itemStyle: {
            color: `rgba(${color}, .5)`,
        },
        smooth: 0.2,
        ...options,
    };
}
