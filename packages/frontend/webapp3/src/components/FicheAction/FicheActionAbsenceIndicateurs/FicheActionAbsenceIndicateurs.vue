<template>
    <FicheRubrique title="Indicateurs de suivi">
        <p class="mt-4 text-center font-bold">
            Il n'y a aucun indicateur de suivi renseigné par l'opérateur pour le
            moment.
        </p>
        <p class="text-center mt-4">
            <Button
                variant="primary"
                class="ml-8"
                icon="pen"
                iconPosition="left"
                @click="routeToUpdateMarks"
                :withoutMargin="true"
                >Mettre à jour les indicateurs</Button
            >
        </p>
    </FicheRubrique>
</template>
<script setup>
import { Button } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";

function routeToUpdateMarks() {}
</script>
