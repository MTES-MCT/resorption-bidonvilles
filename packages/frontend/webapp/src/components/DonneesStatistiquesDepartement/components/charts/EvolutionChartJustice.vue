<template>
    <section>
        <h1 class="font-bold text-primary text-lg">Procédures judiciaires</h1>

        <div class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="person-military-pointing"
                :figure="formatStat(data.figures.police.value)"
                :evolution="formatStat(data.figures.police.evolution)"
                >Nombre total de CFP</ChartBigFigure
            >

            <ChartBigFigure
                icon="scroll"
                :figure="formatStat(data.figures.complaints.value)"
                :evolution="formatStat(data.figures.complaints.evolution)"
                >Nombre total de plaintes</ChartBigFigure
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
const data = departementMetricsStore.evolution.data.justice.justice;

const POLICE_BAR_COLOUR = "rgba(0, 0, 255, 0.5)";
const COMPLAINTS_BAR_COLOUR = "rgba(255, 0, 0, 0.5)";

const chartData = computed(() => {
    const max = {
        police: Math.max(...data.charts.police),
        complaints: Math.max(...data.charts.complaints),
    };
    max.global = Math.max(max.police, max.complaints);

    return {
        labels: data.charts.labels,
        datasets: [
            {
                label: "Nombre de CFP",
                backgroundColor: (context) => {
                    return setBackgroundColor(
                        context,
                        POLICE_BAR_COLOUR,
                        max.police / max.global
                    );
                },
                borderColor: POLICE_BAR_COLOUR,
                pointRadius: 2,
                borderWidth: 2,
                fill: true,
                data: data.charts.police,
                tension: 0.5,
            },
            {
                label: "Nombre de plaintes",
                backgroundColor: (context) => {
                    return setBackgroundColor(
                        context,
                        COMPLAINTS_BAR_COLOUR,
                        max.complaints / max.global
                    );
                },
                borderColor: COMPLAINTS_BAR_COLOUR,
                pointRadius: 2,
                borderWidth: 2,
                fill: true,
                data: data.charts.complaints,
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
            beginAtZero: true,
        },
    },
    plugins: {
        legend: {
            labels: {
                boxWidth: 20,
            },
        },
    },
};
</script>
