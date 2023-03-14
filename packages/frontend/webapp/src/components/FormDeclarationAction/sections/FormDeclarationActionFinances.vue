<template>
    <FormSection id="financements">
        <template v-slot:title>Financements</template>

        <FormDeclarationActionInputFinances />
    </FormSection>
</template>

<script setup>
import FormSection from "@/components/FormSection/FormSection.vue";
import FormDeclarationActionInputFinances from "../inputs/FormDeclarationActionInputFinances.vue";
</script>
