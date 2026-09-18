<template>
    <aside class="text-sm">
        <FicheActionJournalAsideRubrique icon="info-circle" class="mb-4">
            <template v-slot:title>À qui sont destinés les messages ?</template>
            <template v-slot:description
                >À tous les acteurs concernés par l'action. Un mail est
                automatiquement envoyé aux opérateurs ou services en charge de
                l'action, aux acteurs en DDETS et Préfecture, et la
                DIHAL.</template
            >
        </FicheActionJournalAsideRubrique>

        <FicheActionJournalAsideRubrique icon="exclamation-triangle">
            <template v-slot:title
                >Quelles sont les règles de confidentialités ?</template
            >
            <template v-slot:description
                >Ne pas citer l’identité d’individus (nom, âge, sexe, origine…)
                - quel que soit leur statut, ni les informations relatives à des
                condamnations judiciaires. Ne pas tenir de propos à visée
                insultante, discriminatoire, raciste…</template
            >
        </FicheActionJournalAsideRubrique>
    </aside>
</template>

<script setup>
import FicheActionJournalAsideRubrique from "./FicheActionJournalAsideRubrique.vue";
</script>
