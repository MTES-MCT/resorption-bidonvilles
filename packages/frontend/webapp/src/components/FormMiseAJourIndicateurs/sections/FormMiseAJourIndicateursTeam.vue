<template>
    <FormSection id="team">
        <template v-slot:title>Equipe</template>

        <FormMiseAJourIndicateursInputEtp />
    </FormSection>
</template>

<script setup>
import FormSection from "@/components/FormSection/FormSection.vue";
import FormMiseAJourIndicateursInputEtp from "../inputs/FormMiseAJourIndicateursInputEtp.vue";
</script>
