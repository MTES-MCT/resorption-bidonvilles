<template>
    <p>{{ plan.location_details }}</p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
