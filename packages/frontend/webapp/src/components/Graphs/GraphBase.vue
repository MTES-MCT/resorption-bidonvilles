<template>
    <v-chart :option="options" :id="graphId" class="h-32 md:h-80 w-full" />
</template>

<script setup>
import VChart from "vue-echarts";
import { computed, toRefs } from "vue";

const props = defineProps({
    chartOptions: {
        type: Object,
        required: true,
    },
    chartData: { type: Object, required: true },
    graphId: {
        type: String,
        required: true,
    },
});

const { chartOptions, chartData, graphId } = toRefs(props);
const options = computed(() => {
    return {
        ...chartOptions.value.options,
        series: chartData.value,
    };
});
</script>
