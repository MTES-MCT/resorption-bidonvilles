<template>
    <section>
        <h1 class="font-bold text-primary text-lg">
            Évolution des procédures judiciaires
        </h1>
        <p class="mt-2">
            Description du graphique dans un texte qui peut faire un paragraphe
            ou plus...
        </p>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="person-military-pointing"
                :figure="1768"
                :evolution="3"
                >Nombre total de CFP</ChartBigFigure
            >

            <ChartBigFigure icon="scroll" :figure="1256" :evolution="123"
                >Nombre total de plaintes</ChartBigFigure
            >

            <ChartBigFigure icon="balance-scale" :figure="512" :evolution="-12"
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
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";

const chartData = {
    labels: ["January", "February", "March"],
    datasets: [
        {
            label: "Nombre de CFP",
            backgroundColor: ["rgba(242, 242, 249, 0.7)"],
            fill: true,
            data: [40, 20, 12],
        },
        {
            label: "Nombre de sites fermés suite à une procédure judiciaire",
            backgroundColor: ["rgba(233, 246, 238, 0.7)"],
            fill: true,
            data: [35, 2, 150],
        },
    ],
};
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
