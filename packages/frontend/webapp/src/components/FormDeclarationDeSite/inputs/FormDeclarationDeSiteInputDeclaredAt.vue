<template>
    <DatepickerInput
        name="declared_at"
        id="declared_at"
        :label="labels.declared_at"
        :minDate="values.built_at || undefined"
        :maxDate="new Date()"
        showMandatoryStar
        v-model="values.declared_at"
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";

const values = useFormValues();
</script>
