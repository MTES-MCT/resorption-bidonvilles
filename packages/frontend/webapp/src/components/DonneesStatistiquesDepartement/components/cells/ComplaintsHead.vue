<template>
    <BoolCell :value="town?.owner_complaint" />
</template>

<script setup>
import { toRefs } from "vue";
import BoolCell from "./BoolCell.vue";

const props = defineProps({ town: Object });
const { town } = toRefs(props);
</script>
