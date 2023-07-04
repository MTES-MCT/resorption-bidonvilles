<template>
    <BoolCell :value="town.access_to_electricity === 'good'" />
</template>

<script setup>
import { toRefs } from "vue";
import BoolCell from "../BoolCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
