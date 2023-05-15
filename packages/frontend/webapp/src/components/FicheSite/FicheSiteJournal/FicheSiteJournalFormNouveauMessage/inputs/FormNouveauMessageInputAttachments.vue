<template>
    <InputFiles
        name="attachments"
        id="attachments"
        :label="labels.attachments"
        :multiple="true"
    />
</template>

<script setup>
import { InputFiles } from "@resorptionbidonvilles/ui";

import labels from "../FicheSiteJournalFormNouveauMessage.labels";
</script>
