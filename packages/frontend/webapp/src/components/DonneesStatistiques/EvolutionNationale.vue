<template>
    <Spinner v-if="loading" class="text-3xl text-primary" />
    <section v-else>
        <section class="mb-8">
            <h1 class="font-bold text-primary text-lg">
                Nombre de sites et d'habitants en France métropolitaine
                (exclusivement intra UE et + de 10 personnes)
            </h1>
            <LineChart
                class="mt-6"
                :chartOptions="options"
                :chartData="chartData.datasets.intraEU"
                :graphId="`evolution-intraEU`"
            />
        </section>
        <section>
            <h1 class="font-bold text-primary text-lg">
                Nombre de sites et d'habitants en France métropolitaine (toutes
                origines et + de 10 personnes)
            </h1>
            <LineChart
                class="mt-6"
                :chartOptions="options"
                :chartData="chartData.datasets.total"
                :graphId="`evolution-extraEU`"
            />
        </section>
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import LineChart from "@/components/Graphs/GraphBase.vue";
import chartOptions from "../DonneesStatistiquesDepartement/utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../DonneesStatistiquesDepartement/utils/GraphiquesDonneesStatistiques/generateDataset";
import { useMetricsStore } from "@/stores/metrics.store";
import { Spinner } from "@resorptionbidonvilles/ui";
import { onLoad } from "@sentry/vue";

const metricsStore = useMetricsStore();

const data = ref(metricsStore.evolution.data.value);
const loading = ref(metricsStore.evolution.isLoading);

const chartData = computed(() => {
    const datasets = {
        intraEU: [
            generateDataset(
                "Habitants intra UE",
                "81, 108, 157",
                data.value.inhabitants.european,
                {
                    lineStyle: { opacity: 1 },
                    area: true,
                    symbolSize: 1,
                }
            ),
            generateDataset(
                "Sites exclusivement intra UE",
                "0, 0, 255",
                data.value.shantytowns.onlyEUcount,
                {
                    yAxisIndex: 1,
                    lineStyle: { width: 2, color: "rgba(0, 0, 255, 1)" },
                    symbolSize: 1,
                }
            ),
        ],
        total: [
            generateDataset(
                "Habitants toutes origines",
                "204, 135, 59",
                data.value.inhabitants.total,
                {
                    lineStyle: { opacity: 1 },
                    area: true,
                    symbolSize: 1,
                }
            ),
            generateDataset(
                "Sites",
                "156, 102, 82",
                data.value.shantytowns.count,
                {
                    yAxisIndex: 1,
                    lineStyle: { width: 2, color: "rgba(156, 102, 82, 1)" },
                    symbolSize: 1,
                }
            ),
        ],
    };

    return {
        labels: data.value.inhabitants.labels,
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
                data: data.value.inhabitants.labels,
                axisTick: {
                    show: true,
                    alignWithLabel: false,
                    interval: 0,
                },
            },
            yAxis: [
                {
                    type: "value",
                    name: "Habitants",
                    position: "left",
                    alignTicks: true,
                    axisLine: {
                        show: true,
                    },
                    axisTick: {
                        show: true,
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return Math.floor(value).toLocaleString();
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                    min: function (value) {
                        return Math.floor(value.min - value.min * 0.1);
                    },
                    max: function (value) {
                        return Math.ceil(value.max + value.max * 0.04);
                    },
                },
                {
                    type: "value",
                    name: "Sites",
                    position: "right",
                    alignTicks: false,
                    min: function (value) {
                        return Math.floor(value.min - value.min * 0.1);
                    },
                    max: function (value) {
                        return Math.ceil(value.max + value.max * 0.04);
                    },
                    axisLine: {
                        show: true,
                    },
                    axisTick: {
                        show: true,
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return Math.floor(value).toLocaleString();
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                },
            ],
            legend: {
                data: [
                    { name: "Habitants intra UE", icon: "roundRect" },
                    { name: "Habitants toutes origines", icon: "roundRect" },
                    {
                        name: "Sites exclusivement intra UE",
                        icon: "path://M 3 1 L 10 1 L 10 2 L 3 2 M 3 1 L 3 1",
                    },
                    {
                        name: "Sites",
                        icon: "path://M 3 1 L 10 1 L 10 2 L 3 2 M 3 1 L 3 1",
                    },
                ],
            },
        },
    };
});

watch(metricsStore.evolution, (newDatas) => {
    if (newDatas.data?.value !== data.value) {
        loading.value = true;
        data.value = metricsStore.evolution.data.value;
        loading.value = newDatas.isLoading;
    }
});

onLoad(async () => {
    if (!data.value) {
        await metricsStore.fetchEvolution();
    }
});
</script>
