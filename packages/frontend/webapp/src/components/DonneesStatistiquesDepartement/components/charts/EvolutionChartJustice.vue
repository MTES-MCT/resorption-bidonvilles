<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Procédures judiciaires</h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="person-military-pointing"
                :figure="formatStat(data.figures.police.value)"
                :evolution="formatStat(data.figures.police.evolution)"
                >Nombre total de CFP</ChartBigFigure
            >

            <ChartBigFigure
                icon="scroll"
                :figure="formatStat(data.figures.complaints.value)"
                :evolution="formatStat(data.figures.complaints.evolution)"
                >Nombre total de plaintes</ChartBigFigure
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
import formatStat from "@/utils/formatStat";
import { computed } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";
import setBackgroundColor from "../../utils/setBackgroundColor";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.justice.justice;

const chartData = computed(() => ({
    labels: data.charts.labels,
    datasets: [
        {
            label: "Nombre de CFP",
            backgroundColor: ["#FFB7A5"],
            fill: true,
            data: data.charts.police,
            tension: 0.5,
        },
        {
            label: "Nombre de plaintes",
            backgroundColor: (context) => {
                return setBackgroundColor(context, "rgba(0, 0, 255, 0.5)");
            },
            fill: true,
            data: data.charts.complaints,
            tension: 0.5,
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};
</script>
