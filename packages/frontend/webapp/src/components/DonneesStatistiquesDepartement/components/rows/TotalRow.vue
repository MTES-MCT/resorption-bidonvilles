<template>
    <tr class="bg-blue100 text-right">
        <td class="text-left font-bold py-1">Total</td>
        <td v-for="col in columns" :key="col.uid">
            <template v-if="col.primaryMetric">{{ totals[col.uid] }}</template>
            <template v-else>&nbsp;</template>
        </td>
    </tr>
</template>

<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    metrics: {
        type: Array,
        required: true,
    },
});
const { columns, metrics } = toRefs(props);

const totals = computed(() => {
    const totals = {};
    columns.value.forEach((col) => {
        totals[col.uid] = 0;
    });

    metrics.value.forEach(({ summary }) => {
        columns.value.forEach((col) => {
            totals[col.uid] += summary[col.uid] || 0;
        });
    });

    return totals;
});
</script>
