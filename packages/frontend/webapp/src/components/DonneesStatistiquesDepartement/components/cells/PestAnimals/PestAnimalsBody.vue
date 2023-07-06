<template>
    <LivingConditionCell :value="town.absence_of_pest_animals" />
</template>

<script setup>
import { toRefs } from "vue";
import LivingConditionCell from "../LivingConditionCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
