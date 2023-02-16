<template>
    <TextArea
        name="location_autre"
        id="location_autre"
        :label="labels.location_autre"
        :rows="5"
        showMandatoryStar
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";
</script>
