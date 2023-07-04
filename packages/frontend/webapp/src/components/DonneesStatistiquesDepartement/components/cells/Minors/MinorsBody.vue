<template>
    <IntCell :value="town.number_of_minors" />
</template>

<script setup>
import { toRefs } from "vue";
import IntCell from "../IntCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
