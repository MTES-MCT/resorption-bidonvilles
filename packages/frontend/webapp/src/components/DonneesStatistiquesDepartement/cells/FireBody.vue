<template>
    <BoolCell :value="town.fire_prevention" />
</template>

<script setup>
import { toRefs } from "vue";
import BoolCell from "./BoolCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
