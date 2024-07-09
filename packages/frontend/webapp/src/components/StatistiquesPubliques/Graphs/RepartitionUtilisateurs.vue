<template>
    <PieChart
        :chartOptions="options"
        :chartData="chartData"
        :graphId="`repartition-utilisateurs`"
        class="p-4 pb-0 pr-8 h-full min-h-80 w-full"
    />
</template>

<script setup>
import { toRefs, computed } from "vue";
import PieChart from "@/components/Graphs/GraphBase.vue";
import chartOptions from "../../DonneesStatistiquesDepartement/utils/GraphiquesDonneesStatistiques/ChartOptions";
import generatePieDataset from "../../DonneesStatistiquesDepartement/utils/GraphiquesDonneesStatistiques/generatePieDataset";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const { data } = toRefs(props);

const chartData = computed(() => {
    return generatePieDataset(
        data.value.datasets[0].label,
        data.value.datasets[0].backgroundColor,
        data.value.datasets[0].data,
        data.value.labels
    );
});

const options = computed(() => {
    return {
        ...chartOptions.pie,
    };
});
</script>
