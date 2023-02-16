<template>
    <TextArea
        name="goals"
        id="goals"
        :label="labels.goals"
        :rows="5"
        showMandatoryStar
    />
</template>

<script setup>
import { TextArea } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";
</script>
