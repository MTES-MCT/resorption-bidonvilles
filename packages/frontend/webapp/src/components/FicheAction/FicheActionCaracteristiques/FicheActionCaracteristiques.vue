<template>
    <FicheRubrique title="Intervention" id="caracteristiques">
        <FicheActionChampsIntervention
            :plan="plan"
            :border="false"
            :marginTop="false"
        />
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
