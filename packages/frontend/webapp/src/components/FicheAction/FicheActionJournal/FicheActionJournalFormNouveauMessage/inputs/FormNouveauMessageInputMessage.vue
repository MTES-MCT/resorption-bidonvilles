<template>
    <TextArea
        :rows="5"
        id="comment"
        :label="labels.comment"
        placeholder="Partagez vos informations concernant l'action"
        @paste="onPaste"
    />
</template>

<script setup>
import labels from "../FicheActionJournalFormNouveauMessage.labels";
import { TextArea } from "@resorptionbidonvilles/ui";

const emit = defineEmits(["paste"]);
function onPaste(...args) {
    emit("paste", ...args);
}
</script>
