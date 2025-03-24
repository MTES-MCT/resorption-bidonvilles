<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Scolarisation</h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="children"
                :figure="formatStat(data.figures.minors.value)"
                :evolution="formatStat(data.figures.minors.evolution)"
                neutral
                >Mineurs</ChartBigFigure
            >
            <ChartBigFigure
                icon="school"
                :figure="formatStat(data.figures.minors_in_school.value)"
                :evolution="formatStat(data.figures.minors_in_school.evolution)"
                :invert="true"
                >Mineurs scolarisés</ChartBigFigure
            >
        </div>

        <LineChart
            class="mt-6"
            :chartOptions="options"
            :chartData="chartData.datasets"
            :graphId="`evolution-inhabitants`"
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
const data = departementMetricsStore.evolution.data.inhabitants.towns;

const chartData = computed(() => {
    const datasets = [
        generateDataset("Nombre de mineurs", "0, 0, 255", data.charts.minors, {
            lineStyle: { opacity: 1 },
            area: true,
            symbolSize: 1,
        }),
        generateDataset(
            "Nombre de mineurs scolarisés",
            "0, 255, 0",
            data.charts.minors_in_school,
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
