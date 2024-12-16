<template>
    <DatepickerInput
        id="closed_at"
        width="w-64"
        name="closed_at"
        :label="labels.closed_at"
        :clearable="false"
        v-bind="$attrs"
        v-model="values.closed_at"
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import labels from "../FormFermetureDeSite.labels";
import { DatepickerInput } from "@resorptionbidonvilles/ui";

const values = useFormValues();
</script>
