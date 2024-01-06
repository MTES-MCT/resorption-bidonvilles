<template>
    <section>
        <h1 class="font-bold text-primary text-lg"><slot name="title" /></h1>

        <div v-if="data !== undefined" class="flex mt-4 space-x-6">
            <ChartBigFigure
                v-if="chartType === 'towns'"
                icon="map-pin"
                :figure="formatStat(data.figures.towns_total.value)"
                :evolution="formatStat(data.figures.towns_total.evolution)"
                >Nombre total de sites</ChartBigFigure
            >

            <ChartBigFigure
                v-if="chartType === 'inhabitants'"
                icon="people-group"
                :figure="formatStat(data.figures.inhabitants_total.value)"
                :evolution="
                    formatStat(data.figures.inhabitants_total.evolution)
                "
                >Nombre total de personnes</ChartBigFigure
            >

            <ChartBigFigure
                :icon="icon"
                :figure="formatStat(data.figures[livingConditionType].value)"
                :evolution="
                    formatStat(data.figures[livingConditionType].evolution)
                "
                invert
                >{{ chartLabel }}</ChartBigFigure
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
import { computed, toRefs } from "vue";
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";
import chartOptions from "../../utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../../utils/GraphiquesDonneesStatistiques/generateDataset";

const props = defineProps({
    chartLabel: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
    },
    livingConditionType: {
        type: String,
        required: true,
    },
    chartType: {
        type: String,
    },
    icon: {
        type: String,
    },
});
const { chartLabel, data, livingConditionType, chartType, icon } =
    toRefs(props);

const chartData = computed(() => {
    const max = {
        total: Math.max(
            ...data.value.charts[
                chartType.value === "towns"
                    ? "towns_total"
                    : "inhabitants_total"
            ]
        ),
        value: Math.max(...data.value.charts[livingConditionType.value]),
    };
    max.global = Math.max(max.total, max.value);

    const datasets = [
        generateDataset(
            `Nombre total de ${
                chartType.value === "towns" ? "sites" : "personnes"
            }`,
            "rgba(0, 0, 255, 0.5)",
            data.value.charts[
                chartType.value === "towns"
                    ? "towns_total"
                    : "inhabitants_total"
            ],
            max.global
        ),
        generateDataset(
            chartLabel.value,
            "rgba(0, 255, 0, 0.5)",
            data.value.charts[livingConditionType.value],
            max.global
        ),
    ];

    return {
        labels: data.value.charts.labels,
        datasets,
    };
});
</script>
