<template>
    <DatepickerInput
        name="date"
        id="date"
        :label="labels.date"
        :minDate="minDate"
        :maxDate="today"
        width="w-64"
        showMandatoryStar
    />
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import labels from "../FormMiseAJourIndicateurs.labels";

import { DatepickerInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    minDate: {
        type: Date,
        required: false,
        default: undefined,
    },
});
const { minDate } = toRefs(props);
const today = new Date();
</script>
