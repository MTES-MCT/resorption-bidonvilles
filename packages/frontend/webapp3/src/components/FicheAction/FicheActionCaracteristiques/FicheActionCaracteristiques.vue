<template>
    <FicheRubrique title="Intervention">
        <FicheActionChampsIntervention :plan="plan" />
        <FicheActionDates :plan="plan" />
        <FicheActionObjectifs :plan="plan" />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheActionChampsIntervention from "./FicheActionChampsIntervention.vue";
import FicheActionDates from "./FicheActionDates.vue";
import FicheActionObjectifs from "./FicheActionObjectifs.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
