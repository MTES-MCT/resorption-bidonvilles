<template>
    <DatepickerInput
        name="built_at"
        id="built_at"
        :label="labels.built_at"
        :maxDate="values.declared_at || new Date()"
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

const values = useFormValues();
</script>
