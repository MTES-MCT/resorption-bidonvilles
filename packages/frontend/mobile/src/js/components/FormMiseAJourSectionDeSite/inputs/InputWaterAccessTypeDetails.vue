<template>
    <TextArea
        name="water_access_type_details"
        id="water_access_type_details"
        info="Veuillez préciser les modalités d'accès"
        placeholder="Votre message"
        variant="filter"
        showMandatoryStar
        :rows="4"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
</script>
