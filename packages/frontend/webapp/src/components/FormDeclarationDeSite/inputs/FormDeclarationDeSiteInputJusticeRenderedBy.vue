<template>
    <TextInput
        name="justice_rendered_by"
        id="justice_rendered_by"
        :label="labels.justice_rendered_by"
        info="Exemple : tribunal de grande instance"
        showMandatoryStar
    />
</template>

<script setup>
import { TextInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";
</script>
