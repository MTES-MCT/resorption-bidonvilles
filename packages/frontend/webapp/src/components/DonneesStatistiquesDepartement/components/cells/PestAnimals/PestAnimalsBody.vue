<template>
    <BoolCell :value="town.absence_of_pest_animals === 'good'" />
</template>

<script setup>
import { toRefs } from "vue";
import BoolCell from "../BoolCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
