<template>
    <FormSection id="lieu">
        <template v-slot:title>Lieu</template>

        <FormParagraph :title="labels.location_type" showMandatoryStar>
            <InputLocationDepartement :disable="disableDepartement" />
            <InputLocationType />
            <InputLocationAutre v-if="values.location_type === 'autre'" />
            <InputLocationETI v-else-if="values.location_type === 'eti'" />
            <InputLocationShantytowns
                v-else-if="values.location_type === 'sur_site'"
            />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";

import InputLocationType from "../inputs/FormDeclarationActionInputLocationType.vue";
import InputLocationDepartement from "../inputs/FormDeclarationActionInputLocationDepartement.vue";
import InputLocationAutre from "../inputs/FormDeclarationActionInputLocationAutre.vue";
import InputLocationETI from "../inputs/FormDeclarationActionInputLocationETI.vue";
import InputLocationShantytowns from "../inputs/FormDeclarationActionInputLocationShantytowns.vue";

const props = defineProps({
    disableDepartement: Boolean,
});
const { disableDepartement } = toRefs(props);

const values = useFormValues();
</script>
