<template>
    <FormSection id="date" variant="gray">
        <template #title>
            Renseignement de la date de mise à jour des données
        </template>
        <InputUpdateToDate :withoutMargin="values.update_to_date === 1" />
        <InputUpdatedAt
            v-if="values.update_to_date === 0"
            :minDate="minDate"
            withoutMargin
        />
    </FormSection>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import InputUpdateToDate from "../inputs/FormDeclarationDeSiteInputUpdateToDate.vue";
import InputUpdatedAt from "../inputs/FormDeclarationDeSiteInputUpdatedAt.vue";

const values = useFormValues();
const props = defineProps({
    minDate: {
        type: Date,
        required: false,
        default: undefined,
    },
});
const { minDate } = toRefs(props);
</script>
