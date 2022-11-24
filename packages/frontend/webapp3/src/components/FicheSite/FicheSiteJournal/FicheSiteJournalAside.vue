<template>
    <aside class="text-sm">
        <template v-if="!town.closedAt">
            <FicheSiteJournalAsideRubrique icon="info-circle" class="mb-4">
                <template v-slot:title
                    >À qui sont destinés les messages ?</template
                >
                <template v-slot:description
                    >À tous les acteurs du site. Un mail est automatiquement
                    envoyé aux personnes signalées « intervenant sur ce site»,
                    aux acteurs en DDETS, Préfecture et la Dihal.</template
                >
            </FicheSiteJournalAsideRubrique>

            <FicheSiteJournalAsideRubrique icon="exclamation-triangle">
                <template v-slot:title
                    >Quelles sont les règles de confidentialités ?</template
                >
                <template v-slot:description
                    >Ne pas citer l’identité des individus (nom, âge, sexe,
                    origine…), ni les infos relatives à d'éventuelles
                    condamnations judiciaires. Ne pas tenir de propos à visée
                    insultante, discriminatoire, raciste…</template
                >
            </FicheSiteJournalAsideRubrique>
        </template>
    </aside>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import FicheSiteJournalAsideRubrique from "./FicheSiteJournalAsideRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
