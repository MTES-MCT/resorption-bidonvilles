<template>
    <DatepickerInput
        name="police_requested_at"
        id="police_requested_at"
        :label="labels.police_requested_at"
        :minDate="values.built_at || undefined"
        :maxDate="new Date()"
        showMandatoryStar
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

const values = useFormValues();
</script>
