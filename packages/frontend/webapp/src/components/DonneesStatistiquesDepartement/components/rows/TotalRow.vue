<template>
    <tr class="bg-blue100 text-right">
        <td class="text-left font-bold py-1">Total</td>
        <td v-for="col in columns" :key="col.uid">?</td>
    </tr>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
});
const { columns } = toRefs(props);
</script>
