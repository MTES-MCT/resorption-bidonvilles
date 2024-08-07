<template>
    <section>
        <h1 class="font-bold text-primary text-lg">
            Nombre de sites et d'habitants (toutes origines)
        </h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="people-group"
                :figure="formatStat(data.inhabitants.figures.total.value)"
                :evolution="
                    formatStat(data.inhabitants.figures.total.evolution)
                "
                >Toutes origines</ChartBigFigure
            >

            <ChartBigFigure
                icon="location-dot"
                :figure="formatStat(data.towns.figures.total.value)"
                :evolution="formatStat(data.towns.figures.total.evolution)"
                >Tous sites</ChartBigFigure
            >
        </div>

        <LineChart
            class="mt-6"
            :chartOptions="options"
            :chartData="chartData.datasets"
            :graphId="`evolution-towns`"
        />
    </section>
</template>

<script setup>
import formatStat from "@/utils/formatStat";
import { computed } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import LineChart from "@/components/Graphs/GraphBase.vue";
import ChartBigFigure from "./ChartBigFigure.vue";
import chartOptions from "../../utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../../utils/GraphiquesDonneesStatistiques/generateDataset";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.inhabitants;
console.log(data);
const chartData = computed(() => {
    const datasets = [
        generateDataset(
            "Habitants toutes origines",
            "204, 135, 59",
            data.inhabitants.charts.total,
            {
                lineStyle: { opacity: 1 },
                area: true,
                symbolSize: 1,
            }
        ),
        generateDataset("Sites", "156, 102, 82", data.towns.charts.total, {
            yAxisIndex: 1,
            lineStyle: { width: 2, color: "rgba(156, 102, 82, 1)" },
            symbolSize: 1,
        }),
    ];

    return {
        labels: data.inhabitants.charts.labels,
        datasets,
    };
});

// const options = computed(() => {
//     return {
//         ...chartOptions.line,
//         options: {
//             ...chartOptions.line.options,
//             xAxis: {
//                 ...chartOptions.line.options.xAxis,
//                 data: data.charts.labels,
//                 axisTick: {
//                     show: true,
//                     alignWithLabel: false,
//                     interval: 0,
//                 },
//             },
//         },
//     };
// });
const options = computed(() => {
    return {
        ...chartOptions.line,
        options: {
            ...chartOptions.line.options,
            xAxis: {
                ...chartOptions.line.options.xAxis,
                data: data.inhabitants.charts.labels,
                axisTick: {
                    show: true,
                    alignWithLabel: false,
                    interval: 0,
                },
            },
            yAxis: [
                {
                    type: "value",
                    name: "Habitants",
                    position: "left",
                    alignTicks: true,
                    axisLine: {
                        show: true,
                    },
                    axisTick: {
                        show: true,
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return Math.floor(value).toLocaleString();
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                    min: function (value) {
                        return Math.floor(value.min - value.min * 0.1);
                    },
                    max: function (value) {
                        return Math.ceil(value.max + value.max * 0.04);
                    },
                },
                {
                    type: "value",
                    name: "Sites",
                    position: "right",
                    alignTicks: false,
                    min: function (value) {
                        return Math.floor(value.min - value.min * 0.1);
                    },
                    max: function (value) {
                        return Math.ceil(value.max + value.max * 0.04);
                    },
                    axisLine: {
                        show: true,
                    },
                    axisTick: {
                        show: true,
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return Math.floor(value).toLocaleString();
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                },
            ],
            legend: {
                data: [
                    { name: "Habitants intra UE", icon: "roundRect" },
                    { name: "Habitants toutes origines", icon: "roundRect" },
                    {
                        name: "Sites exclusivement intra UE",
                        icon: "path://M 3 1 L 10 1 L 10 2 L 3 2 M 3 1 L 3 1",
                    },
                    {
                        name: "Sites",
                        icon: "path://M 3 1 L 10 1 L 10 2 L 3 2 M 3 1 L 3 1",
                    },
                ],
            },
        },
    };
});
</script>
