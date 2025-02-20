<template>
    <IntCell :value="formatStat(town.number_of_schooled_minors)" />
</template>

<script setup>
import formatStat from "@/utils/formatStat";
import { toRefs } from "vue";
import IntCell from "../IntCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
