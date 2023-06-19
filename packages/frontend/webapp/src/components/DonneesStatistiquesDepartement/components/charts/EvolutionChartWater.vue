<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Accès à l'eau</h1>
        <p class="mt-2">
            Description du graphique dans un texte qui peut faire un paragraphe
            ou plus...
        </p>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure icon="map-pin" :figure="15" :evolution="3"
                >Nombre total de sites</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="123" :evolution="-2"
                >Nombre total de personnes</ChartBigFigure
            >

            <ChartBigFigure
                icon="faucet-drip"
                :figure="12"
                :evolution="0"
                invert
                >Nombre de personnes avec accès à l'eau</ChartBigFigure
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
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";

const chartData = {
    labels: ["January", "February", "March"],
    datasets: [
        {
            label: "Nombre total de personnes",
            backgroundColor: ["rgba(0, 0, 145, 0.3)"],
            fill: true,
            data: [125, 115, 123],
        },
        {
            label: "Nombre de personnes avec accès à l'eau",
            backgroundColor: ["#FFB7A5"],
            fill: true,
            data: [0, 10, 12],
        },
    ],
};
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
