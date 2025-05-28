<template>
    <IntCell :value="formatStat(data.summary.number_of_persons)" />
</template>

<script setup>
import formatStat from "@common/utils/formatStat";
import { toRefs } from "vue";
import IntCell from "../IntCell.vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
