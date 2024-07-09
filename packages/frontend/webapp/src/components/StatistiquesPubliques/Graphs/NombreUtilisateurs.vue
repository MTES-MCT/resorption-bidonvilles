<template>
    <LineChart
        :chartOptions="options"
        :chartData="chartData.datasets"
        :graphId="`evolution-users`"
    />
</template>

<script setup>
import { toRefs, computed } from "vue";
import LineChart from "@/components/Graphs/GraphBase.vue";
import chartOptions from "../../DonneesStatistiquesDepartement/utils/GraphiquesDonneesStatistiques/ChartOptions";
import generateDataset from "../../DonneesStatistiquesDepartement/utils/GraphiquesDonneesStatistiques/generateDataset";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const { data } = toRefs(props);

const chartData = computed(() => {
    const datasets = [
        generateDataset(
            "Nombre d'utilisateurs inscrits",
            "0, 0, 255",
            data.value.datasets[0].data,
            {
                lineStyle: {
                    width: 2,
                    color: "rgba(0, 0, 255, 1)",
                    opacity: 1,
                },
                area: false,
                symbolSize: 1,
            }
        ),
        generateDataset(
            "Nombre d'utilisateurs actifs",
            "81, 108, 157",
            data.value.datasets[1].data,
            {
                area: true,
                symbolSize: 1,
                lineStyle: { opacity: 1 },
            }
        ),
    ];
    return { labels: data.value.labels, datasets };
});

const options = computed(() => {
    return {
        ...chartOptions.line,
        options: {
            ...chartOptions.line.options,
            xAxis: {
                ...chartOptions.line.options.xAxis,
                data: data.value.labels,
                axisTick: {
                    show: true,
                    alignWithLabel: false,
                    interval: 0,
                },
                axisLabel: {
                    rotate: 45,
                    interval: 1,
                },
            },
            legend: {
                data: [
                    {
                        name: "Nombre d'utilisateurs inscrits",
                        icon: "path://M 3 1 L 10 1 L 10 2 L 3 2 M 3 1 L 3 1",
                    },
                    {
                        name: "Nombre d'utilisateurs actifs",
                        icon: "roundRect",
                    },
                ],
            },
        },
    };
});
</script>
