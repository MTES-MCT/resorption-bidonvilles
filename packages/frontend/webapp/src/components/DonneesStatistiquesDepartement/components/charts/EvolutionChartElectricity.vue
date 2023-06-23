<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Accès à l'électricité</h1>
        <p class="mt-2">
            Description du graphique dans un texte qui peut faire un paragraphe
            ou plus...
        </p>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="map-pin"
                :figure="data.figures.towns_total.value"
                :evolution="data.figures.towns_total.evolution"
                >Nombre total de sites</ChartBigFigure
            >

            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.inhabitants_total.value"
                :evolution="data.figures.inhabitants_total.evolution"
                >Nombre total de personnes</ChartBigFigure
            >

            <ChartBigFigure
                icon="bolt"
                :figure="data.figures.access_to_electricity.value"
                :evolution="data.figures.access_to_electricity.evolution"
                invert
                >Nombre de personnes avec accès à l'électricité</ChartBigFigure
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
const data =
    departementMetricsStore.evolution.data.livingConditions.electricity;

const chartData = computed(() => ({
    labels: data.charts.labels,
    datasets: [
        {
            label: "Nombre total de personnes",
            backgroundColor: ["rgba(0, 0, 145, 0.3)"],
            fill: true,
            data: data.charts.inhabitants_total,
        },
        {
            label: "Nombre de personnes avec accès à l'électricité",
            backgroundColor: ["#FFB7A5"],
            fill: true,
            data: data.charts.access_to_electricity,
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
