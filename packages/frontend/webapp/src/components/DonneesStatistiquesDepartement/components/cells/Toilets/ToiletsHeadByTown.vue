<template>
    {{ data.summary.number_of_towns_with_toilets }}<br />
    <span class="text-sm"
        >({{ data.summary.percentage_of_towns_with_toilets }} %)</span
    >
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
