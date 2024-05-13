<template>
    <DatepickerInput
        name="insalubrity_order_at"
        id="insalubrity_order_at"
        :label="labels.insalubrity_order_at"
        :minDate="values.built_at || undefined"
        :maxDate="new Date()"
        v-model="values.insalubrity_order_at"
    />
</template>

<script setup>
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import { useFormValues } from "vee-validate";
import labels from "../FormDeclarationDeSite.labels";

const values = useFormValues();
</script>
