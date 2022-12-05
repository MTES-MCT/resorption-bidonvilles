<template>
    <DatepickerInput
        name="justice_rendered_at"
        id="justice_rendered_at"
        :label="labels.justice_rendered_at"
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
