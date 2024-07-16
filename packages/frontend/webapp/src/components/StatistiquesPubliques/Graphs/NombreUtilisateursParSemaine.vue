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
            "255, 0, 0",
            data.value.datasets[0].data,
            {
                lineStyle: {
                    opacity: 1,
                },
                area: true,
                symbolSize: 1,
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
                    interval: 3,
                },
            },
        },
    };
});
</script>
