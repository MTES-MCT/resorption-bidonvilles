<template>
    <DatepickerInput
        name="police_granted_at"
        id="police_granted_at"
        :label="labels.police_granted_at"
        :minDate="values.police_requested_at"
        showMandatoryStar
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

const values = useFormValues();
</script>
