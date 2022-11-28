<template>
    <FicheRubrique title="Indicateurs de suivi" id="indicateurs">
        <p class="mt-6 text-center">
            Il n'y a aucun indicateur de suivi renseigné par l'opérateur pour le
            moment.
        </p>

        <p class="text-center mt-4" v-if="plan.canUpdateMarks">
            <Button
                variant="primary"
                class="ml-8"
                icon="pen"
                iconPosition="left"
                :href="`/action/${plan.id}/indicateurs/mise-a-jour`"
                >Mettre à jour les indicateurs</Button
            >
        </p>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);
</script>
