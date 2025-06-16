<template>
    <FormSection id="resorption">
        <template v-slot:title>Phases préparatoires à la résorption</template>

        <Fieldset legend="Quelles sont les phases réalisées ?">
            <InputPreparatoryPhaseTowardResorption />
        </Fieldset>
    </FormSection>
</template>

<script setup>
import { Fieldset } from "@resorptionbidonvilles/ui";
import FormSection from "@/components/FormSection/FormSection.vue";
import InputPreparatoryPhaseTowardResorption from "../inputs/FormDeclarationDeSiteInputResorptionPhases.vue";
</script>
