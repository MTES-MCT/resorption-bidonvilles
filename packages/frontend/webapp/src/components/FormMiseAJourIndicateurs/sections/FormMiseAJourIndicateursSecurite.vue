<template>
    <FormSection id="securite">
        <template v-slot:title>Stabilisation et sécurisation du site</template>

        <FormParagraph title="Nombre...">
            <FormMiseAJourIndicateursTextInput
                name="points_eau"
                :label="labels.points_eau"
            ></FormMiseAJourIndicateursTextInput>
            <FormMiseAJourIndicateursTextInput
                name="wc"
                :label="labels.wc"
            ></FormMiseAJourIndicateursTextInput>
            <FormMiseAJourIndicateursTextInput
                name="electricite"
                :label="labels.electricite"
            ></FormMiseAJourIndicateursTextInput>
            <FormMiseAJourIndicateursTextInput
                name="nombre_bennes"
                :label="labels.nombre_bennes"
            ></FormMiseAJourIndicateursTextInput>
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import labels from "../FormMiseAJourIndicateurs.labels";

import FormMiseAJourIndicateursTextInput from "../inputs/FormMiseAJourIndicateursTextInput.vue";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
</script>
