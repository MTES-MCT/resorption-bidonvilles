<template>
    <FormSection id="lieu">
        <template v-slot:title>Lieu</template>

        <FormParagraph :title="labels.location_type" showMandatoryStar>
            <InputLocationDepartement :disable="disableDepartement" />
            <InputLocationType />
            <InputLocationAutre v-if="values.location_type === 'autre'" />
            <InputLocationETIMultiple
                v-else-if="values.location_type === 'eti'"
                :setFieldValue="setFieldValue"
                :setErrors="setErrors"
            />
            <InputLocationShantytowns
                v-else-if="values.location_type === 'sur_site'"
            />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";

import InputLocationType from "../inputs/FormDeclarationActionInputLocationType.vue";
import InputLocationDepartement from "../inputs/FormDeclarationActionInputLocationDepartement.vue";
import InputLocationAutre from "../inputs/FormDeclarationActionInputLocationAutre.vue";
import InputLocationETIMultiple from "../inputs/FormDeclarationActionInputLocationETIMultiple.vue";
import InputLocationShantytowns from "../inputs/FormDeclarationActionInputLocationShantytowns.vue";

const props = defineProps({
    disableDepartement: Boolean,
    setFieldValue: Function,
    setErrors: Function,
});
const { disableDepartement, setFieldValue, setErrors } = toRefs(props);

const values = useFormValues();
const locationETIMultipleRef = ref(null);

defineExpose({
    locationETIMultipleRef,
});
</script>
