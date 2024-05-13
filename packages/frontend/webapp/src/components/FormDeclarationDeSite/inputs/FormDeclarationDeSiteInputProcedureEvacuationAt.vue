<template>
    <DatepickerInput
        name="administrative_order_evacuation_at"
        id="administrative_order_evacuation_at"
        :label="labels.administrative_order_evacuation_at"
        :minDate="values.built_at || undefined"
        :maxDate="new Date()"
        v-model="values.administrative_order_evacuation_at"
    />
</template>

<script setup>
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import { useFormValues } from "vee-validate";
import labels from "../FormDeclarationDeSite.labels";

const values = useFormValues();
</script>
