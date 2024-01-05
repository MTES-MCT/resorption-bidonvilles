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

    const datasets = [
        generateDataset(
            "Nombre de CFP",
            POLICE_BAR_COLOUR,
            data.charts.police,
            max.global
        ),
        generateDataset(
            "Nombre de plaintes",
            COMPLAINTS_BAR_COLOUR,
            data.charts.complaints,
            max.global
        ),
    ];

    return {
        labels: data.charts.labels,
        datasets,
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
            // Empêche le clic sur la légende pour masquer la courbe correspondante
            // Evite les problèmes d'affichage des dégradés quand une courbe est masquée
            onClick: function (event) {
                if (event.type === "legend-click") {
                    const dataset = event.target.dataset;
                    if (dataset) {
                        return false;
                    }
                }
            },
            labels: {
                boxWidth: 20,
            },
        },
    },
};

function generateDataset(label, color, data, maxGlobal) {
    return {
        label,
        backgroundColor: (context) => {
            return setBackgroundColor(
                context,
                color,
                Math.max(...data) / maxGlobal
            );
        },
        borderColor: color,
        pointRadius: 2,
        borderWidth: 2,
        fill: true,
        data,
        tension: 0.5,
    };
}
</script>
