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
import chartOptions from "../../utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../../utils/GraphiquesDonneesStatistiques/generateDataset";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.justice.justice;

const chartData = computed(() => {
    const max = {
        police: Math.max(...data.charts.police),
        complaints: Math.max(...data.charts.complaints),
    };
    max.global = Math.max(max.police, max.complaints);

    const datasets = [
        generateDataset(
            "Nombre de CFP",
            "rgba(0, 0, 255, 0.5)",
            data.charts.police,
            max.global
        ),
        generateDataset(
            "Nombre de plaintes",
            "rgba(255, 0, 0, 0.5)",
            data.charts.complaints,
            max.global
        ),
    ];

    return {
        labels: data.charts.labels,
        datasets,
    };
});
</script>
