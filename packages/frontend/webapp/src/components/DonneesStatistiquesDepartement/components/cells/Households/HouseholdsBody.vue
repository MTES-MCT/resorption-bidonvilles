<template>
    <IntCell :value="formatStat(town.number_of_households)" />
</template>

<script setup>
import formatStat from "@common/utils/formatStat";
import { toRefs } from "vue";
import IntCell from "../IntCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
