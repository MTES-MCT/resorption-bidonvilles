<template>
    <TextArea
        :rows="5"
        id="answer"
        :label="labels.answer"
        placeholder="Saisissez ici votre réponse"
    />
</template>

<script setup>
import labels from "../FicheQuestionNouvelleReponse.labels";
import { TextArea } from "@resorptionbidonvilles/ui";
</script>
