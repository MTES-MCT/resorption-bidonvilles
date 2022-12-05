<template>
    <TextArea
        :rows="5"
        id="comment"
        :label="labels.comment"
        placeholder="Partagez vos informations concernant l'action"
    />
</template>

<script setup>
import labels from "../FicheActionJournalFormNouveauMessage.labels";
import { TextArea } from "@resorptionbidonvilles/ui";
</script>
