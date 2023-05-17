<template>
    <InputFiles
        name="attachments"
        :label="labels.attachments"
        :multiple="true"
    />
</template>

<script setup>
import { InputFiles } from "@resorptionbidonvilles/ui";
import labels from "../FicheQuestionNouvelleReponse.labels";
</script>
