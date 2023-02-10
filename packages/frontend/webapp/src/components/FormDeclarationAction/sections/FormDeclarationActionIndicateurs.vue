<template>
    <FormSection id="indicateurs">
        <template v-slot:title>Indicateurs</template>

        <InputIndicateursAnnuels />
        <InputIndicateursScolaires
            v-if="values.topics && values.topics.includes('school')"
        />
    </FormSection>
</template>

<script setup>
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";

import InputIndicateursAnnuels from "../inputs/FormDeclarationActionInputIndicateursAnnuels.vue";
import InputIndicateursScolaires from "../inputs/FormDeclarationActionInputIndicateursScolaires.vue";

const values = useFormValues();
</script>
