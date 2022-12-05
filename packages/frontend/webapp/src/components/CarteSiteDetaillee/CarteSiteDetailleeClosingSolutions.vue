<template>
    <SolutionsDeFermeture
        :shantytownClosingSolutions="shantytown.closingSolutions"
    ></SolutionsDeFermeture>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import SolutionsDeFermeture from "@/components/SolutionsDeFermeture/SolutionsDeFermeture.vue";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
