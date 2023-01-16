<template>
    <FicheRubrique title="Habitants" category="people">
        <p class="italic mt-4">
            Le nombre de personnes sur un site est mouvant, les données fournies
            par les acteurs, même des estimations, participent à l'amélioration
            de la connaissance.
        </p>

        <div class="overflow-x-auto w-200 mt-4">
            <FicheSiteHabitantsTableau :town="town" />
        </div>
        <FicheSiteHabitantsOrigines :border="false" :town="town" />
        <FicheSiteHabitantsDiagnosticSocial :town="town" />
        <FicheSiteHabitantsReinstallation :town="town" />
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteHabitantsTableau from "./FicheSiteHabitantsTableau.vue";
import FicheSiteHabitantsOrigines from "./FicheSiteHabitantsOrigines.vue";
import FicheSiteHabitantsDiagnosticSocial from "./FicheSiteHabitantsDiagnosticSocial.vue";
import FicheSiteHabitantsReinstallation from "./FicheSiteHabitantsReinstallation.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
