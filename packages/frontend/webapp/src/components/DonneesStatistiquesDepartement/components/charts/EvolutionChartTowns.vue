<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Nombre de sites</h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="tent"
                :figure="data.figures.total.value"
                :evolution="data.figures.total.evolution"
                >Tous sites</ChartBigFigure
            >

            <ChartBigFigure
                icon="tent"
                :figure="data.figures.less_than_10.value"
                :evolution="data.figures.less_than_10.evolution"
                >Sites de moins de 10 habitants</ChartBigFigure
            >

            <ChartBigFigure
                icon="tent"
                :figure="data.figures.between_10_and_99.value"
                :evolution="data.figures.between_10_and_99.evolution"
                >Sites de moins de 100 habitants</ChartBigFigure
            >

            <ChartBigFigure
                icon="tent"
                :figure="data.figures.more_than_99.value"
                :evolution="data.figures.more_than_99.evolution"
                >Sites de plus de 100 habitants</ChartBigFigure
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
import { computed } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import LineChart from "@/components/Graphs/GraphBase.vue";
import ChartBigFigure from "./ChartBigFigure.vue";
import chartOptions from "../../utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../../utils/GraphiquesDonneesStatistiques/generateDataset";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.inhabitants.towns;

const chartData = computed(() => {
    const datasets = [
        generateDataset(
            "Sites de moins de 10 habitants",
            "255, 0, 0",
            data.charts.less_than_10,
            {
                lineStyle: { opacity: 1 },
                area: true,
                symbolSize: 1,
            }
        ),
        generateDataset(
            "Sites de moins de 100 habitants",
            "0, 0, 255",
            data.charts.between_10_and_99,
            {
                lineStyle: { opacity: 1 },
                area: true,
                symbolSize: 1,
            }
        ),
        generateDataset(
            "Sites de plus de 100 habitants",
            "0, 255, 0",
            data.charts.more_than_99,
            {
                lineStyle: { opacity: 1 },
                area: true,
                symbolSize: 1,
            }
        ),
    ];

    return {
        labels: data.charts.labels,
        datasets,
    };
});

const options = computed(() => {
    return {
        ...chartOptions.line,
        options: {
            ...chartOptions.line.options,
            xAxis: {
                ...chartOptions.line.options.xAxis,
                data: data.charts.labels,
                axisTick: {
                    show: true,
                    alignWithLabel: false,
                    interval: 0,
                },
            },
        },
    };
});
</script>
