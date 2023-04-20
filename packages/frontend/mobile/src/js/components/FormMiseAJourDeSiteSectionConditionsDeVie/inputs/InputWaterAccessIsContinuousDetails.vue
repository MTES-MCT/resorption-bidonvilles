<template>
    <TextArea
        name="water_access_is_continuous_details"
        id="water_access_is_continuous_details"
        info="Veuillez préciser"
        variant="filter"
        placeholder="Votre message"
        showMandatoryStar
        :rows="2"
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
</script>
