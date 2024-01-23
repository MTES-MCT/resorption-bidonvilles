<template>
    <InputFiles
        name="attachments"
        :label="labels.attachments"
        :multiple="true"
        ref="input"
    />
</template>

<script setup>
import { ref } from "vue";
import { InputFiles } from "@resorptionbidonvilles/ui";
import labels from "../FicheQuestionNouvelleReponse.labels";

const input = ref(null);
defineExpose({
    addFiles: (...args) =>
        input.value?.addFiles ? input.value?.addFiles(...args) : null,
});
</script>
