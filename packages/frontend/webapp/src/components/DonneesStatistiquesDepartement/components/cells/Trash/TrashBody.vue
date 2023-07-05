<template>
    <LivingConditionCell :value="town.trash_evacuation" />
</template>

<script setup>
import { toRefs } from "vue";
import LivingConditionCell from "../LivingConditionCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
