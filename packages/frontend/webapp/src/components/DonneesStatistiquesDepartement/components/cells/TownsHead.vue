<template>
    <IntCell :value="data.summary.number_of_towns" />
</template>

<script setup>
import { toRefs } from "vue";
import IntCell from "./IntCell.vue";

const props = defineProps({ data: Object });
const { data } = toRefs(props);
</script>
