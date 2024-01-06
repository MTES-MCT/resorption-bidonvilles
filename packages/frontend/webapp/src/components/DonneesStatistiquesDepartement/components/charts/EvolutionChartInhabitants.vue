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
import chartOptions from "../../utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../../utils/GraphiquesDonneesStatistiques/generateDataset";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.inhabitants.inhabitants;

const chartData = computed(() => {
    const max = {
        european: Math.max(...data.charts.european),
        foreign: Math.max(...data.charts.foreign),
        total: Math.max(...data.charts.total),
    };
    max.global = Math.max(max.european, max.foreign, max.total);

    const datasets = [
        generateDataset(
            "Nombre d'habitants intra-UE",
            "rgba(255, 0, 0, 0.5)",
            data.charts.european,
            max.global
        ),
        generateDataset(
            "Nombre d'habitants extra-UE",
            "rgba(0, 255, 0, 0.5)",
            data.charts.foreign,
            max.global
        ),
        generateDataset(
            "Nombre total d'habitants",
            "rgba(0, 0, 255, 0.5)",
            data.charts.total,
            max.global
        ),
    ];

    return {
        labels: data.charts.labels,
        datasets,
    };
});
</script>
