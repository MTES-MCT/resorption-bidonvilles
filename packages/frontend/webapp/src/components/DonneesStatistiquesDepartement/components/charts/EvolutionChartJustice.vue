<template>
    <section>
        <h1 class="font-bold text-primary text-lg">
            Évolution des procédures judiciaires
        </h1>

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

            <ChartBigFigure
                icon="balance-scale"
                :figure="data.figures.closed_towns.value"
                :evolution="data.figures.closed_towns.evolution"
                >Nombre de sites fermés suite à une procédure
                judiciaire</ChartBigFigure
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
const data = departementMetricsStore.evolution.data.justice.justice;

const chartData = computed(() => ({
    labels: data.charts.labels,
    datasets: [
        {
            label: "Nombre de CFP",
            backgroundColor: ["rgba(242, 242, 249, 0.7)"],
            fill: true,
            data: data.charts.police,
        },
        {
            label: "Nombre de sites fermés suite à une procédure judiciaire",
            backgroundColor: ["rgba(233, 246, 238, 0.7)"],
            fill: true,
            data: data.charts.closed_towns,
        },
        {
            label: "Nombre de plaintes",
            backgroundColor: ["rgba(233, 246, 238, 0.7)"],
            fill: true,
            data: data.charts.complaints,
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    y: {
        beginAtZero: true,
    },
};
</script>
