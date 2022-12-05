<template>
    <DatepickerInput
        name="declared_at"
        id="declared_at"
        :label="labels.declared_at"
        :minDate="values.built_at || undefined"
        showMandatoryStar
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

const values = useFormValues();
</script>
