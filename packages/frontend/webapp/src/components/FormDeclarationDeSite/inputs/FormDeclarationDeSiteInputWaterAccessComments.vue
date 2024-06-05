<template>
    <TextArea
        name="water_access_comments"
        id="water_access_comments"
        :label="labels.water_access_comments"
        info="Saisissez ici vos remarques, autres remontées d’informations ou descriptions (ex : nombre de points d’eau, de robinets, description des installations…)"
        placeholder="Votre message"
        :rows="4"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
