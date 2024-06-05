<template>
    <DatepickerInput
        name="built_at"
        id="built_at"
        :label="labels.built_at"
        :maxDate="values.declared_at || new Date()"
        v-model="values.built_at"
    />
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";

const values = useFormValues();
</script>
