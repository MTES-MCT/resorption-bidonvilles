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
            :chartOptions="options"
            :chartData="chartData.datasets"
            :graphId="`evolution-living-conditions`"
        />
    </section>
</template>

<script setup>
import formatStat from "@/utils/formatStat";
import { computed, toRefs } from "vue";
import LineChart from "@/components/Graphs/GraphBase.vue";
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
    const datasets = [
        generateDataset(
            `Nombre total de ${
                chartType.value === "towns" ? "sites" : "personnes"
            }`,
            "0, 0, 255",
            data.value.charts[
                chartType.value === "towns"
                    ? "towns_total"
                    : "inhabitants_total"
            ]
        ),
        generateDataset(
            chartLabel.value,
            "0, 255, 0",
            data.value.charts[livingConditionType.value]
        ),
    ];

    return {
        labels: data.value.charts.labels,
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
                data: data.value.charts.labels,
            },
        },
    };
});
</script>
