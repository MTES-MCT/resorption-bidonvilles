<template>
    <DatepickerInput
        name="administrative_order_decision_at"
        id="administrative_order_decision_at"
        :label="labels.administrative_order_decision_at"
        :minDate="values.built_at || undefined"
        :maxDate="new Date()"
        v-model="values.administrative_order_decision_at"
    />
</template>

<script setup>
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import { useFormValues } from "vee-validate";
import labels from "../FormDeclarationDeSite.labels";

const values = useFormValues();
</script>
