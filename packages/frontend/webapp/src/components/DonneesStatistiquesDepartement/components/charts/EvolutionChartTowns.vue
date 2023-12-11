<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Nombre de sites</h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="map-pin"
                :figure="formatStat(data.figures.total.value)"
                :evolution="formatStat(data.figures.total.evolution)"
                >Tous sites</ChartBigFigure
            >

            <ChartBigFigure
                icon="map-pin"
                :figure="formatStat(data.figures.less_than_10.value)"
                :evolution="formatStat(data.figures.less_than_10.evolution)"
                >Sites de moins de 10 habitants</ChartBigFigure
            >

            <ChartBigFigure
                icon="map-pin"
                :figure="formatStat(data.figures.between_10_and_99.value)"
                :evolution="
                    formatStat(data.figures.between_10_and_99.evolution)
                "
                >Sites de moins de 100 habitants</ChartBigFigure
            >

            <ChartBigFigure
                icon="map-pin"
                :figure="formatStat(data.figures.more_than_99.value)"
                :evolution="formatStat(data.figures.more_than_99.evolution)"
                >Sites de plus de 100 habitants</ChartBigFigure
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
const data = departementMetricsStore.evolution.data.inhabitants.towns;

const chartData = computed(() => ({
    labels: data.charts.labels,
    datasets: [
        {
            label: "Sites de moins de 10 habitants",
            backgroundColor: (context) => {
                return setBackgroundColor(context, "rgba(255, 0, 0, 0.5)");
            },
            fill: true,
            data: data.charts.less_than_10,
            Stack: "Stack 0",
            tension: 0.5,
        },
        {
            label: "Sites de moins de 100 habitants",
            backgroundColor: (context) => {
                return setBackgroundColor(context, "rgba(0, 255, 0, 0.5)");
            },
            fill: true,
            data: data.charts.between_10_and_99,
            Stack: "Stack 0",
            tension: 0.5,
        },
        {
            label: "Sites de plus de 100 habitants",
            backgroundColor: (context) => {
                return setBackgroundColor(context, "rgba(0, 0, 255, 0.5)");
            },
            fill: true,
            data: data.charts.more_than_99,
            Stack: "Stack 0",
            tension: 0.5,
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            stacked: false,
            beginAtZero: true,
        },
    },
};
</script>
