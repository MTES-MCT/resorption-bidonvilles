<template>
    <section>
        <h1 class="font-bold text-primary text-lg">
            Évolution du nombre d'habitants
        </h1>
        <p class="mt-2">
            Description du graphique dans un texte qui peut faire un paragraphe
            ou plus...
        </p>

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
            label: "Nombre total d'habitants",
            backgroundColor: ["rgba(242, 242, 249, 0.7)"],
            fill: true,
            data: data.charts.total,
        },
        {
            label: "Nombre d'habitants intra-UE",
            backgroundColor: ["rgba(253, 242, 243, 0.7)"],
            fill: true,
            data: data.charts.european,
        },
        {
            label: "Nombre d'habitants extra-UE",
            backgroundColor: ["rgba(233, 246, 238, 0.7)"],
            fill: true,
            data: data.charts.foreign,
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
