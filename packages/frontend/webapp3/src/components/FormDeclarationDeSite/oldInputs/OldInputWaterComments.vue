<template>
    <TextArea
        name="old_water_comments"
        label="Modalités d'accès"
        info="Exemples : citerne remplie par les pompiers tous les jours, 3 robinets raccordés par la collectivité, borne incendie… Champ obligatoire si le point d'eau est public."
        placeholder="Votre message"
        disabled
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
</script>
