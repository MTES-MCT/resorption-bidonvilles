<template>
    <p>{{ action.location_other }}</p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
</script>
