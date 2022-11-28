<template>
    <p>{{ plan.location.label }}</p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

// TODO à réintégrer avec la minicarte
// const address = computed(() => {
//     return {
//         latitude: plan.value.location.latitude,
//         longitude: plan.value.location.longitude,
//         address: plan.value.location.label,
//     };
// });

// const center = computed(() => {
//     return {
//         center: [plan.value.location.latitude, plan.value.location.longitude],
//         zoom: 15,
//     };
// });
</script>
