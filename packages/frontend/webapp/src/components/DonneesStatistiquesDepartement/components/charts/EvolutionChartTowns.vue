<template>
    <section>
        <h1 class="font-bold text-primary text-lg">
            Évolution du nombre de sites
        </h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.total.value"
                :evolution="data.figures.total.evolution"
                >Nombre total de sites</ChartBigFigure
            >

            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.less_than_10.value"
                :evolution="data.figures.less_than_10.evolution"
                >Nombre de sites de moins de 10 habitants</ChartBigFigure
            >

            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.between_10_and_99.value"
                :evolution="data.figures.between_10_and_99.evolution"
                >Nombre de sites de moins de 100 habitants</ChartBigFigure
            >

            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.more_than_99.value"
                :evolution="data.figures.more_than_99.evolution"
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
import { computed } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.inhabitants.towns;

const chartData = computed(() => ({
    labels: data.charts.labels,
    datasets: [
        {
            label: "Nombre total de sites",
            backgroundColor: ["rgba(242, 242, 249, 0.7)"],
            fill: true,
            data: data.charts.total,
        },
        {
            label: "Nombre de sites de moins de 10 habitants",
            backgroundColor: ["rgba(253, 242, 243, 0.7)"],
            fill: true,
            data: data.charts.less_than_10,
        },
        {
            label: "Nombre de sites de moins de 100 habitants",
            backgroundColor: ["rgba(233, 246, 238, 0.7)"],
            fill: true,
            data: data.charts.between_10_and_99,
        },
        {
            label: "Nombre de sites de plus de 100 habitants",
            backgroundColor: ["rgba(0, 0, 145, 0.7)"],
            fill: true,
            data: data.charts.more_than_99,
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
