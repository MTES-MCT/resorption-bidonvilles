<template>
    <FormSection id="resorption">
        <template v-slot:title>Étapes de la résorption</template>

        <Fieldset legend="Quelles sont les étapes réalisées ?">
            <InputPreparatoryPhaseTowardResorption />
        </Fieldset>
    </FormSection>
</template>

<script setup>
import { Fieldset } from "@resorptionbidonvilles/ui";
import FormSection from "@/components/FormSection/FormSection.vue";
import InputPreparatoryPhaseTowardResorption from "../inputs/FormDeclarationDeSiteInputResorptionPhases.vue";
</script>
