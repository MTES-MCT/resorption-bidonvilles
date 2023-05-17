<template>
    <InputFiles
        name="attachments"
        :label="labels.attachments"
        :multiple="true"
        ref="input"
    />
</template>

<script setup>
import { defineExpose, computed, ref } from "vue";
import { InputFiles } from "@resorptionbidonvilles/ui";

import labels from "../FicheSiteJournalFormNouveauMessage.labels";

const input = ref(null);
const isFocused = computed(() => {
    return input.value?.isFocused;
});

defineExpose({
    isFocused,
    addFiles: (...args) =>
        input.value?.addFiles ? input.value.addFiles(...args) : null,
});
</script>
