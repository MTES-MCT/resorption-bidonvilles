import { graphic } from "echarts";

export default {
    bar: {
        id: "bar",
        series: [],
        options: {},
        darkMode: true,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
            {
                offset: 0,
                color: "rgb(184, 169, 252)",
            },
            {
                offset: 1,
                color: "rgb(112, 93, 206)",
            },
        ]),
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
            formatter: "{b}: {c}%",
            valueFormatter: (value) => {
                return value.toLocaleString();
            },
        },
        grid: {
            top: "0",
            left: "0",
            right: "15",
            bottom: "0",
            containLabel: true,
        },
        xAxis: {
            type: "value",
            axisLabel: {
                color: "#fff",
                formatter: "{value}%",
            },
            splitLine: {
                show: false,
            },
        },
        yAxis: {
            type: "category",
            axisLabel: {
                color: "#fff",
            },
        },
    },
    line: {
        id: "line",
        series: [],
        options: {
            chart: {
                type: "line",
            },
            tooltip: {
                show: true,
                trigger: "axis",
                order: "valueDesc",
                confine: true,
                valueFormatter: (value) => {
                    return value.toLocaleString();
                },
            },
            legend: {
                textStyle: {
                    color: "#000",
                },
                icon: "roundRect",
            },
            grid: {
                top: "30",
                left: "10",
                right: "10",
                bottom: "0",
                containLabel: true,
            },
            stroke: {
                curve: "smooth",
            },
            xAxis: {
                type: "category",
                axisLabel: {
                    alignMinLabel: "left",
                    alignMaxLabel: "right",
                },
                boundaryGap: false,
            },
            yAxis: {
                type: "value",
                boundaryGap: [0, "2%"],
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: true,
                },
                axisLine: {
                    show: true,
                },
                axisLabel: {
                    formatter: (value) => {
                        return value.toLocaleString();
                    },
                },
            },
            colorBy: "series",
        },
    },
    pie: {
        options: {
            legend: {
                orient: "vertical",
                left: "right",
                top: "top",
            },
            tooltip: {
                trigger: "item",
                position: "right",
                valueFormatter: (value) => {
                    return value.toLocaleString();
                },
            },
            labelLine: {
                show: false,
            },
        },
    },
    mixed: {
        id: "mixed",
        darkMode: true,
        series: [],
        options: {
            chart: {
                type: "line",
            },
            color: new graphic.LinearGradient(0, 0, 1, 0, [
                {
                    offset: 0,
                    color: "rgb(184, 169, 252)",
                },
                {
                    offset: 1,
                    color: "rgb(112, 93, 206)",
                },
            ]),
            legend: {
                selected: {
                    KD: false,
                },
                textStyle: {
                    color: "#fff",
                },
                icon: "roundRect",
            },
            emphasis: {
                selectorLabel: {
                    show: true,
                },
            },
            tooltip: {
                trigger: "axis",
                confine: true,
                backgroundColor: "rgba(51, 51, 51, .8)",
                borderColor: "#858585",
                textStyle: {
                    color: "white",
                },
                axisPointer: {
                    type: "shadow",
                    snap: true,
                    label: {
                        show: true,
                        backgroundColor: "#333",
                    },
                },
                valueFormatter: (value) => {
                    return value.toLocaleString();
                },
            },
            yAxis: [
                {
                    type: "value",
                    axisLabel: {
                        color: "#fff",
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#4A4A4A",
                        },
                    },
                },
                {
                    type: "value",
                    axisLabel: {
                        color: "#fff",
                    },
                    splitLine: {
                        show: false,
                    },
                },
                {
                    type: "value",
                    axisLabel: {
                        color: "#fff",
                    },
                    show: false,
                    min: 0,
                    max: 1,
                    splitLine: {
                        show: false,
                    },
                },
            ],
            xAxis: {
                type: "category",
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    color: "#fff",
                    rotate: 45,
                },
            },
            grid: {
                top: "20",
                left: "0",
                right: "0",
                bottom: "20",
                containLabel: true,
            },
            series: [],
        },
    },
};
