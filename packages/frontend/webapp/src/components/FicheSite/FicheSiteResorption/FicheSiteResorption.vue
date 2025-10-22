<template>
    <FicheRubrique
        title="Phases préparatoires à la résorption"
        category="resorption"
    >
        <FicheSiteResorptionPhasesListeVide
            v-if="town.preparatoryPhasesTowardResorption?.length === 0"
            :town="town"
            class="my-4"
        />
        <FicheSiteResorptionPhasesListe v-else :town="town" class="my-4" />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteResorptionPhasesListeVide from "./FicheSiteResorptionPhasesListeVide.vue";
import FicheSiteResorptionPhasesListe from "./FicheSiteResorptionPhasesListe.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
