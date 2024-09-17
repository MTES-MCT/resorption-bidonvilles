<template>
    <TextInput
        name="census_conducted_by"
        id="census_conducted_by"
        :label="labels.census_conducted_by"
        showMandatoryStar
    />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";
</script>
