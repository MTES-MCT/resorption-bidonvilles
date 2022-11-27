<template>
    <FicheSiteRubrique title="Habitants">
        <p class="italic mt-4">
            Le nombre de personnes sur un site est mouvant, les données fournies
            par les acteurs, même des estimations, participent à l'amélioration
            de la connaissance.
        </p>

        <div class="overflow-x-auto mt-4">
            <FicheSiteHabitantsTableau :town="town" />
        </div>
        <FicheSiteHabitantsOrigines :border="false" :town="town" />
        <FicheSiteHabitantsDiagnosticSocial :town="town" />
        <FicheSiteHabitantsReinstallation :town="town" />
    </FicheSiteRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheSiteRubrique from "../FicheSiteRubrique.vue";
import FicheSiteHabitantsTableau from "./FicheSiteHabitantsTableau.vue";
import FicheSiteHabitantsOrigines from "./FicheSiteHabitantsOrigines.vue";
import FicheSiteHabitantsDiagnosticSocial from "./FicheSiteHabitantsDiagnosticSocial.vue";
import FicheSiteHabitantsReinstallation from "./FicheSiteHabitantsReinstallation.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
