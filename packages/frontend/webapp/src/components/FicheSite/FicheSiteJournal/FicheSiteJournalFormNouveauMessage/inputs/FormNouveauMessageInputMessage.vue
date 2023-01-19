<template>
    <TextArea
        :rows="rows"
        id="comment"
        :label="labels.comment"
        placeholder="Partagez votre passage sur le site, le contexte sanitaire, la situation des habitants, difficultés rencontrées lors de votre intervention…"
    />
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import labels from "../FicheSiteJournalFormNouveauMessage.labels";
import { TextArea } from "@resorptionbidonvilles/ui";

const props = defineProps({
    rows: Number,
});
const { rows } = toRefs(props);
</script>
