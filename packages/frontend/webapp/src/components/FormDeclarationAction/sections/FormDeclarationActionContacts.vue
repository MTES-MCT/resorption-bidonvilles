<template>
    <FormSection id="contacts">
        <template v-slot:title>Contacts</template>

        <FormParagraph title="Quels sont les contacts ?">
            <InputManagers />
            <InputOperators />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph } from "@resorptionbidonvilles/ui";
import InputManagers from "../inputs/FormDeclarationActionInputManagers.vue";
import InputOperators from "../inputs/FormDeclarationActionInputOperators.vue";
</script>
