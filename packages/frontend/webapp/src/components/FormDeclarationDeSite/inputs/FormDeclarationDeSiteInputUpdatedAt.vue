<template>
    <DatepickerInput
        name="updated_at"
        id="updated_at"
        :label="labels.updated_at"
        :minDate="minDate"
        :maxDate="yesterday"
        width="w-64"
        showMandatoryStar
    />
</template>

<script setup>
import { toRefs } from "vue";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

const props = defineProps({
    minDate: {
        type: Date,
        required: false,
        default: undefined,
    },
});
const { minDate } = toRefs(props);
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
</script>
