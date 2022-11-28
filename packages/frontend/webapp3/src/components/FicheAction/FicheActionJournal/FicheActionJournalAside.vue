<template>
    <aside class="text-sm">
        <template v-if="!plan.closed_at">
            <FicheActionJournalAsideRubrique icon="info-circle" class="mb-4">
                <template v-slot:title
                    >À qui sont destinés les messages ?</template
                >
                <template v-slot:description
                    >À tous les acteurs concernés par l'action. Un mail est
                    automatiquement envoyé aux opérateurs ou services en charge
                    de l'action, aux acteurs en DDETS et Préfecture, et la
                    DIHAL.</template
                >
            </FicheActionJournalAsideRubrique>

            <FicheActionJournalAsideRubrique icon="exclamation-triangle">
                <template v-slot:title
                    >Quelles sont les règles de confidentialités ?</template
                >
                <template v-slot:description
                    >Ne pas citer l’identité des individus (nom, âge, sexe,
                    origine…), ni les infos relatives à d'éventuelles
                    condamnations judiciaires. Ne pas tenir de propos à visée
                    insultante, discriminatoire, raciste…</template
                >
            </FicheActionJournalAsideRubrique>
        </template>
    </aside>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import FicheActionJournalAsideRubrique from "./FicheActionJournalAsideRubrique.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
