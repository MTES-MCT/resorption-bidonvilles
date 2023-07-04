<template>
    {{ data.summary.number_of_inhabitants_with_heatwave }}<br />
    <span class="text-sm"
        >({{ data.summary.percentage_of_inhabitants_with_heatwave }} %)</span
    >
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
