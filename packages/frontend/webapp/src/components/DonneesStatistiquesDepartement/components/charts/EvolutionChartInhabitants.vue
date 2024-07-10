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
            :chartOptions="options"
            :chartData="chartData.datasets"
            :graphId="`evolution-inhabitants`"
        />
    </section>
</template>

<script setup>
import formatStat from "@/utils/formatStat";
import { computed } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import LineChart from "@/components/Graphs/GraphBase.vue";
import ChartBigFigure from "./ChartBigFigure.vue";
import flagEU from "@/assets/img/flags/eu.png";
import flagExtraCommunautaires from "@/assets/img/flags/extra-communautaires.png";
import chartOptions from "../../utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../../utils/GraphiquesDonneesStatistiques/generateDataset";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.inhabitants.inhabitants;

const chartData = computed(() => {
    const datasets = [
        generateDataset(
            "Nombre d'habitants intra-UE",
            "0, 0, 255",
            data.charts.european,
            {
                lineStyle: { opacity: 1 },
                area: true,
                symbolSize: 1,
            }
        ),
        generateDataset(
            "Nombre d'habitants extra-UE",
            "255, 0, 0",
            data.charts.foreign,
            {
                lineStyle: { opacity: 1 },
                area: true,
                symbolSize: 1,
            }
        ),
        generateDataset(
            "Nombre total d'habitants",
            "0, 255, 0",
            data.charts.total,
            {
                lineStyle: { opacity: 1 },
                area: true,
                symbolSize: 1,
            }
        ),
    ];

    return {
        labels: data.charts.labels,
        datasets,
    };
});

const options = computed(() => {
    return {
        ...chartOptions.line,
        options: {
            ...chartOptions.line.options,
            xAxis: {
                ...chartOptions.line.options.xAxis,
                data: data.charts.labels,
            },
        },
    };
});
</script>
