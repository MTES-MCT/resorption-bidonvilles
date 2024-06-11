<template>
    <TextArea
        name="reinstallation_comments"
        id="reinstallation_comments"
        :label="labels.reinstallation_comments"
        info="Exemple : adresse de l'ancien site, nombre de personnes concernées, etc."
        placeholder="Votre message"
        :rows="5"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
