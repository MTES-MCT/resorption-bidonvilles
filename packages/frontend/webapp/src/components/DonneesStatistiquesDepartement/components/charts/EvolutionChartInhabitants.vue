<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Nombre d'habitants</h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="people-group"
                :figure="formatStat(data.figures.total.value)"
                :evolution="formatStat(data.figures.total.evolution)"
                >Tous sites</ChartBigFigure
            >

            <ChartBigFigure
                :img="flagEU"
                alt="Estimation du nombre d'habitants intra-UE"
                :figure="formatStat(data.figures.european.value)"
                :evolution="formatStat(data.figures.european.evolution)"
                >Sites exclusivement intra-UE</ChartBigFigure
            >

            <ChartBigFigure
                :img="flagExtraCommunautaires"
                alt="Estimation du nombre d'habitants extra-UE"
                :figure="formatStat(data.figures.foreign.value)"
                :evolution="formatStat(data.figures.foreign.evolution)"
                >Sites exclusivement extra-UE</ChartBigFigure
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
import flagEU from "@/assets/img/flags/eu.png";
import flagExtraCommunautaires from "@/assets/img/flags/extra-communautaires.png";
import setBackgroundColor from "../../utils/setBackgroundColor";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.inhabitants.inhabitants;

const chartData = computed(() => {
    const max = {
        european: Math.max(...data.charts.european),
        foreign: Math.max(...data.charts.foreign),
        total: Math.max(...data.charts.total),
    };
    max.global = Math.max(max.european, max.foreign, max.total);

    return {
        labels: data.charts.labels,
        datasets: [
            {
                label: "Nombre d'habitants intra-UE",
                backgroundColor: (context) => {
                    return setBackgroundColor(
                        context,
                        "rgba(255, 0, 0, 0.5)",
                        max.european / max.global
                    );
                },
                borderColor: "rgba(255, 0, 0, 0.5)",
                pointRadius: 2,
                borderWidth: 2,
                fill: true,
                data: data.charts.european,
                stack: "Stack 0",
                tension: 0.5,
            },
            {
                label: "Nombre d'habitants extra-UE",
                backgroundColor: (context) => {
                    return setBackgroundColor(
                        context,
                        "rgba(0, 255, 0, 0.75)",
                        max.foreign / max.global
                    );
                },
                borderColor: "rgba(0, 255, 0, 0.5)",
                pointRadius: 2,
                borderWidth: 2,
                fill: true,
                data: data.charts.foreign,
                stack: "Stack 0",
                tension: 0.5,
            },
            {
                label: "Nombre total d'habitants",
                backgroundColor: (context) => {
                    return setBackgroundColor(
                        context,
                        "rgba(0, 0, 255, 0.5)",
                        max.total / max.global
                    );
                },
                borderColor: "rgba(0, 0, 255, 0.5)",
                pointRadius: 2,
                borderWidth: 2,
                fill: true,
                data: data.charts.total,
                stack: "Stack 1",
                tension: 0.5,
            },
        ],
    };
});

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
