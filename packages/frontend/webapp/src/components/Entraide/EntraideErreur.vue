<template>
    <ViewError>
        <template v-slot:title>Échec de la collecte des données</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Une erreur est survenue lors de la collecte des questions. Vous
            pouvez réessayer un peu plus tard ou nous contacter.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @clicked="questionsStore.fetchQuestions"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </ViewError>
</template>

<script setup>
import { useQuestionsStore } from "@/stores/questions.store";

import { Button } from "@resorptionbidonvilles/ui";
import ViewError from "@/components/ViewError/ViewError.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const questionsStore = useQuestionsStore();
</script>
