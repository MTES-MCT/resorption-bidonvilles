<template>
    <FicheRubrique title="Intervention" id="caracteristiques">
        <FicheActionChampsIntervention
            :action="action"
            :border="false"
            :marginTop="false"
        />
        <FicheActionDates :action="action" />
        <FicheActionObjectifs :action="action" />
    </FicheRubrique>
</template>

<script setup>
import { toRefs } from "vue";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheActionChampsIntervention from "./FicheActionChampsIntervention.vue";
import FicheActionDates from "./FicheActionDates.vue";
import FicheActionObjectifs from "./FicheActionObjectifs.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
</script>
