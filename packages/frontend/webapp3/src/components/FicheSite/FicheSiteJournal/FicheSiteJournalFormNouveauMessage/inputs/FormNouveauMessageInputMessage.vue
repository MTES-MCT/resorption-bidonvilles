<template>
    <TextArea
        :rows="5"
        id="comment"
        :label="labels.comment"
        placeholder="Partagez votre passage sur le site, le contexte sanitaire, la situation des habitants, difficultés rencontrées lors de votre intervention…"
    />
</template>

<script setup>
import labels from "../FicheSiteJournalFormNouveauMessage.labels";
import { TextArea } from "@resorptionbidonvilles/ui";
</script>
