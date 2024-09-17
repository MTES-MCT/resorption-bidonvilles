<template>
    <DatepickerInput
        name="census_conducted_at"
        id="census_conducted_at"
        :label="labels.census_conducted_at"
        :minDate="values.built_at || undefined"
        showMandatoryStar
        v-model="values.census_conducted_at"
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";

const values = useFormValues();
</script>
