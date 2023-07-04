<template>
    <section>
        <h1 class="font-bold text-primary text-lg">
            Évolution du nombre d'habitants
        </h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.total.value"
                :evolution="data.figures.total.evolution"
                >Nombre total d'habitants</ChartBigFigure
            >

            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.european.value"
                :evolution="data.figures.european.evolution"
                >Estimation du nombre d'habitants intra-UE</ChartBigFigure
            >

            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.foreign.value"
                :evolution="data.figures.foreign.evolution"
                >Estimation du nombre d'habitants extra-UE</ChartBigFigure
            >
        </div>

        <LineChart
            class="mt-6"
            :chartOptions="chartOptions"
            :chartData="chartData"
        />
    </section>
</template>

<script setup>
import { computed } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.inhabitants.inhabitants;

const chartData = computed(() => ({
    labels: data.charts.labels,
    datasets: [
        {
            label: "Nombre d'habitants intra-UE",
            backgroundColor: ["rgba(240, 127, 135, 1)"],
            fill: true,
            data: data.charts.european,
            stack: "Stack 0",
        },
        {
            label: "Nombre d'habitants extra-UE",
            backgroundColor: ["rgba(134, 239, 172, 1)"],
            fill: true,
            data: data.charts.foreign,
            stack: "Stack 0",
        },
        {
            label: "Nombre total d'habitants",
            backgroundColor: ["rgba(127, 127, 200, 0.5)"],
            fill: true,
            data: data.charts.total,
            stack: "Stack 1",
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            stacked: true,
            beginAtZero: true,
        },
    },
};
</script>
