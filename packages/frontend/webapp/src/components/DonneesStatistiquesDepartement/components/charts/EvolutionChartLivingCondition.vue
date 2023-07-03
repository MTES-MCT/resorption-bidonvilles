<template>
    <section>
        <h1 class="font-bold text-primary text-lg"><slot name="title" /></h1>

        <div v-if="data !== undefined" class="flex mt-4 space-x-6">
            <ChartBigFigure
                icon="map-pin"
                :figure="data.figures.towns_total.value"
                :evolution="data.figures.towns_total.evolution"
                >Nombre total de sites</ChartBigFigure
            >

            <ChartBigFigure
                icon="people-group"
                :figure="data.figures.inhabitants_total.value"
                :evolution="data.figures.inhabitants_total.evolution"
                >Nombre total de personnes</ChartBigFigure
            >

            <ChartBigFigure
                icon="bolt"
                :figure="data.figures[livingConditionType].value"
                :evolution="data.figures[livingConditionType].evolution"
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
import { computed, toRefs } from "vue";
import { LineChart } from "@/helpers/chart";
import ChartBigFigure from "./ChartBigFigure.vue";

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
});
const { chartLabel, data, livingConditionType, chartType } = toRefs(props);

const chartData = computed(() => ({
    labels: data.value.charts.labels,
    datasets: [
        {
            label: `Nombre total de ${
                chartType.value === "towns" ? "sites" : "personnes"
            }`,
            backgroundColor: ["rgba(0, 0, 145, 0.3)"],
            fill: true,
            data: data.value.charts[
                chartType.value === "towns"
                    ? "towns_total"
                    : "inhabitants_total"
            ],
        },
        {
            label: chartLabel.value,
            backgroundColor: ["#FFB7A5"],
            fill: true,
            data: data.value.charts[livingConditionType.value],
        },
    ],
}));
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};
</script>
