<template>
    <TextArea
        name="detailed_address"
        id="detailed_address"
        :label="labels.detailed_address"
        info="Saisissez ici toutes les informations qui, en plus de l'adresse, peuvent être utiles pour l'accès au site."
        :rows="5"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
