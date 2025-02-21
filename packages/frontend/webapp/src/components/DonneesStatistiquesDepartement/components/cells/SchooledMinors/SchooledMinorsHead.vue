<template>
    <IntCell :value="formatStat(data.summary.number_of_schooled_minors)" />
</template>

<script setup>
import formatStat from "@/utils/formatStat";
import { toRefs } from "vue";
import IntCell from "../IntCell.vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
