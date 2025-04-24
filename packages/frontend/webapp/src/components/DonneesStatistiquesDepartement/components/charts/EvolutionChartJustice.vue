<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Procédures judiciaires</h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="person-military-pointing"
                :figure="data.figures.police.value"
                :evolution="data.figures.police.evolution"
                >Nombre total de CFP</ChartBigFigure
            >

            <ChartBigFigure
                icon="scroll"
                :figure="data.figures.complaints.value"
                :evolution="data.figures.complaints.evolution"
                >Nombre total de plaintes</ChartBigFigure
            >
        </div>

        <LineChart
            class="mt-6"
            :chartOptions="options"
            :chartData="chartData.datasets"
            :graphId="`evolution-justice`"
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
const data = departementMetricsStore.evolution.data.justice.justice;

const chartData = computed(() => {
    const max = {
        police: Math.max(...data.charts.police),
        complaints: Math.max(...data.charts.complaints),
    };
    max.global = Math.max(max.police, max.complaints);

    const datasets = [
        generateDataset("Nombre de CFP", "0, 0, 255", data.charts.police, {
            lineStyle: { opacity: 1, width: 2, color: "rgba(0, 0, 255, 1)" },
            area: true,
            symbolSize: 1,
        }),
        generateDataset(
            "Nombre de plaintes",
            "255, 0, 0",
            data.charts.complaints,
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
