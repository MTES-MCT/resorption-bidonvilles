<template>
    <LivingConditionCell :value="town.working_toilets" />
</template>

<script setup>
import { toRefs } from "vue";
import LivingConditionCell from "../LivingConditionCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
