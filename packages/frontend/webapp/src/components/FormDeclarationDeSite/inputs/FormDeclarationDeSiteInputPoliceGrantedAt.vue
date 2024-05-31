<template>
    <DatepickerInput
        :name="fieldName"
        :id="fieldName"
        :label="labels.police_granted_at"
        :minDate="values.police_requested_at"
        :maxDate="new Date()"
        :showMandatoryStar
        :v-model="modelName"
    />
</template>

<script setup>
import { toRefs } from "vue";
import { DatepickerInput } from "@resorptionbidonvilles/ui";
import { useFormValues } from "vee-validate";
import labels from "../FormDeclarationDeSite.labels";

const props = defineProps({
    fieldName: {
        type: String,
        required: true,
    },
    modelName: {
        type: String,
        required: true,
    },
    showMandatoryStar: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const { fieldName, modelName, showMandatoryStar } = toRefs(props);

const values = useFormValues();
</script>
