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
            <ChartBigFigure icon="people-group" :figure="1768" :evolution="3"
                >Nombre total d'habitants</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="1256" :evolution="123"
                >Estimation du nombre d'habitants intra-UE</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="512" :evolution="-12"
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
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";

const chartData = {
    labels: ["January", "February", "March"],
    datasets: [
        {
            label: "Nombre total d'habitants",
            backgroundColor: ["rgba(242, 242, 249, 0.7)"],
            fill: true,
            data: [40, 20, 12],
        },
        {
            label: "Nombre d'habitants intra-UE",
            backgroundColor: ["rgba(253, 242, 243, 0.7)"],
            fill: true,
            data: [35, 2, 150],
        },
        {
            label: "Nombre d'habitants extra-UE",
            backgroundColor: ["rgba(233, 246, 238, 0.7)"],
            fill: true,
            data: [123, 92, 96],
        },
    ],
};
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
