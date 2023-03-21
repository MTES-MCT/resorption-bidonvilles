<template>
    <p class="flex space-x-6">
        <DatepickerInput
            name="started_at"
            id="started_at"
            :label="labels.started_at"
            :maxDate="values.ended_at || null"
            showMandatoryStar
        />
        <DatepickerInput
            name="ended_at"
            id="ended_at"
            :label="labels.ended_at"
            info="(effective)"
            inlineInfo
            :minDate="values.started_at"
        />
    </p>
</template>

<script setup>
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";

const values = useFormValues();
</script>
