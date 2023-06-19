<template>
    <header class="flex flex-col xl:flex-row lg:space-x-4 justify-between">
        <div class="flex space-x-4 items-end">
            <div>
                <p>Du</p>
                <DatepickerInput withoutMargin />
            </div>

            <div>
                <p>Au</p>
                <DatepickerInput withoutMargin />
            </div>

            <Button>Valider</Button>
        </div>
        <div class="hidden xl:block">
            <p>&nbsp;</p>
            <p class="flex space-x-4 items-center">
                <Button variant="primaryOutline">L'année dernière</Button>
                <Button variant="primaryOutline">Le mois dernier</Button>
                <Button variant="primaryOutline">La semaine dernière</Button>
            </p>
        </div>
    </header>

    <section class="mt-6">
        <h1 class="font-bold text-primary text-lg">
            Évolution du nombre d'habitants
        </h1>
        <p class="mt-2">
            Description du graphique dans un texte qui peut faire un paragraphe
            ou plus...
        </p>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure icon="people-group" :figure="3"
                >Nombre total d'habitants</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="123"
                >Estimation du nombre d'habitants intra-UE</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="-12"
                >Estimation du nombre d'habitants extra-UE</ChartBigFigure
            >
        </div>

        <LineChart
            class="mt-6"
            :chartOptions="chartOptions"
            :chartData="chartData"
        />
    </section>

    <section class="mt-6">
        <h1 class="font-bold text-primary text-lg">
            Évolution du nombre de sites
        </h1>
        <p class="mt-2">
            Description du graphique dans un texte qui peut faire un paragraphe
            ou plus...
        </p>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure icon="people-group" :figure="3"
                >Nombre total de sites</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="123"
                >Nombre de sites de moins de 10 habitants</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="-12"
                >Nombre de sites de moins de 100 habitants</ChartBigFigure
            >

            <ChartBigFigure icon="people-group" :figure="51"
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

<style scoped>
.down {
    transform: rotate(45deg);
}
.up {
    transform: rotate(-45deg);
}
</style>

<script setup>
import { LineChart } from "@/helpers/chart";
import { Button, DatepickerInput } from "@resorptionbidonvilles/ui";
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
