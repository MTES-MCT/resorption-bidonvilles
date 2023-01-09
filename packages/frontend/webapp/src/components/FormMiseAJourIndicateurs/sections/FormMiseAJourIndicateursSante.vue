<template>
    <FormSection id="sante">
        <template v-slot:title>Santé</template>

        <FormParagraph title="Nombre de personnes...">
            <FormParagraph title="ayant une couverture valide..." size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="ame_valide"
                        :label="labels.ame_valide"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        class="ml-4"
                        name="puma_valide"
                        :label="labels.puma_valide"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>

            <FormParagraph title="ayant une demande en cours..." size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="ame_en_cours"
                        :label="labels.ame_en_cours"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        class="ml-4"
                        name="puma_en_cours"
                        :label="labels.puma_en_cours"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>
        </FormParagraph>
        <FormParagraph
            title="Nombre de personnes ayant fait l'objet d'au moins..."
        >
            <FormMiseAJourIndicateursTextInput
                name="orientation"
                :label="labels.orientation"
            ></FormMiseAJourIndicateursTextInput>
            <FormMiseAJourIndicateursTextInput
                name="accompagnement"
                :label="labels.accompagnement"
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
