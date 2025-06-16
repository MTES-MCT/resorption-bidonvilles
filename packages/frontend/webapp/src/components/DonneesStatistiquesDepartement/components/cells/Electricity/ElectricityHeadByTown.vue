<template>
    {{ formatStat(data.summary.number_of_towns_with_electricity) }}<br />
    <span class="text-sm"
        >({{ data.summary.percentage_of_towns_with_electricity }} %)</span
    >
</template>

<script setup>
import formatStat from "@common/utils/formatStat";
import { toRefs } from "vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
