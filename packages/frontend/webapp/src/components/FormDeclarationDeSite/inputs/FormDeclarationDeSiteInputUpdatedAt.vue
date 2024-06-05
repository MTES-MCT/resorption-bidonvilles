<template>
    <DatepickerInput
        name="updated_at"
        id="updated_at"
        :label="labels.updated_at"
        :minDate="minDate"
        :maxDate="yesterday"
        width="w-64"
        showMandatoryStar
        v-model="values.updated_at"
    />
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useFormValues } from "vee-validate";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";

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

const values = useFormValues();
</script>
