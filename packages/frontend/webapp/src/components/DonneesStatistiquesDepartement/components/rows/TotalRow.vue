<template>
    <tr class="bg-blue100 text-right">
        <td class="text-left font-bold py-1" colspan="2">Total</td>
        <td v-for="col in columns" :key="col.uid">
            <div v-if="totals[col.uid] !== undefined">
                {{ totals[col.uid] }}
            </div>
            <div v-else>&nbsp;</div>
        </td>
        <td></td>
    </tr>
</template>

<script setup>
import { computed, toRefs } from "vue";
import formatStat from "@common/utils/formatStat";

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
        if (metrics.value.summary[col.uid] === undefined) {
            return;
        }
        if (metrics.value.summary[col.uid] === null) {
            totals[col.uid] = 0;
        } else if (metrics.value.summary[col.uid].all !== undefined) {
            totals[col.uid] = formatStat(metrics.value.summary[col.uid].all);
        } else {
            totals[col.uid] = formatStat(metrics.value.summary[col.uid]);
        }
    });

    return totals;
});
</script>
