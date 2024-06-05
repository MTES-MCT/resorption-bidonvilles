<template>
    <TextArea
        name="pest_animals_details"
        id="pest_animals_details"
        :label="labels.pest_animals_details"
        info="Saisissez ici vos remarques, autres remontées d’informations ou descriptions (ex : rats, punaises de lit…)"
        placeholder="Votre message"
        :rows="4"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
