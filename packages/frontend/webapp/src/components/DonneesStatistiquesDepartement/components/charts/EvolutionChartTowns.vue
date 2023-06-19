<template>
    <section>
        <h1 class="font-bold text-primary text-lg">
            Évolution du nombre de sites
        </h1>
        <p class="mt-2">
            Description du graphique dans un texte qui peut faire un paragraphe
            ou plus...
        </p>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure icon="people-group" :figure="15" :evolution="3"
                >Nombre total de sites</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="1" :evolution="123"
                >Nombre de sites de moins de 10 habitants</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="12" :evolution="-12"
                >Nombre de sites de moins de 100 habitants</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="2" :evolution="51"
                >Nombre de sites de plus de 100 habitants</ChartBigFigure
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
            label: "Nombre total de sites",
            backgroundColor: ["rgba(242, 242, 249, 0.7)"],
            fill: true,
            data: [40, 20, 12],
        },
        {
            label: "Nombre de sites de moins de 10 habitants",
            backgroundColor: ["rgba(253, 242, 243, 0.7)"],
            fill: true,
            data: [35, 2, 150],
        },
        {
            label: "Nombre de sites de moins de 100 habitants",
            backgroundColor: ["rgba(233, 246, 238, 0.7)"],
            fill: true,
            data: [123, 92, 96],
        },
        {
            label: "Nombre de sites de plus de 100 habitants",
            backgroundColor: ["rgba(0, 0, 145, 0.7)"],
            fill: true,
            data: [312, 523, 356],
        },
    ],
};
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
