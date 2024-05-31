<template>
    <DatepickerInput
        :name="name"
        :id="name"
        :label="label"
        :minDate="minDate"
        :maxDate="maxDate"
        :showMandatoryStar
        :v-model="modelName"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { DatepickerInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    minDate: {
        type: Date,
        required: false,
    },
    maxDate: {
        type: Date,
        required: false,
    },
    showMandatoryStar: {
        type: Boolean,
        required: false,
        default: false,
    },
    modelName: {
        type: String,
        required: true,
    },
});

const { name, label, minDate, maxDate, showMandatoryStar, modelName } =
    toRefs(props);
</script>
