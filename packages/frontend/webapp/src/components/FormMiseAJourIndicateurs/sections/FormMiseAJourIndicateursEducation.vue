<template>
    <FormSection id="education">
        <template v-slot:title>Éducation et scolarisation</template>

        <FormMiseAJourIndicateursTextInput
            name="scolarisables"
            :label="labels.scolarisables"
        />
        <FormMiseAJourIndicateursTextInput
            name="en_mediation"
            :label="labels.en_mediation"
        />

        <FormParagraph title="Nombre d'enfants inscrits en...">
            <div class="flex">
                <FormMiseAJourIndicateursTextInput
                    name="maternelles"
                    :label="labels.maternelles"
                />
                <FormMiseAJourIndicateursTextInput
                    class="ml-4"
                    name="elementaires"
                    :label="labels.elementaires"
                />
                <FormMiseAJourIndicateursTextInput
                    class="ml-4"
                    name="colleges"
                    :label="labels.colleges"
                />
                <FormMiseAJourIndicateursTextInput
                    class="ml-4"
                    name="lycees"
                    :label="labels.lycees"
                />
            </div>
        </FormParagraph>
        <InputDifficultes />
    </FormSection>
</template>

<script setup>
import labels from "../FormMiseAJourIndicateurs.labels";

import FormMiseAJourIndicateursTextInput from "../inputs/FormMiseAJourIndicateursTextInput.vue";
import InputDifficultes from "../inputs/FormMiseAJourIndicateursEducationInputDifficultes.vue";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
</script>
