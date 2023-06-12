<template>
    {{ data.summary.number_of_justice_procedure }}<br />
    <span class="text-sm"
        >({{ data.summary.percentage_of_justice_procedure }} %)</span
    >
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
