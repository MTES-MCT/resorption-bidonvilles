<template>
    <FormSection id="logement">
        <template v-slot:title>Logement</template>

        <FormParagraph title="Nombre de demandes">
            <FormParagraph title="SIAO" size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="siao.families"
                        :label="labels.siao.families"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        class="ml-4"
                        name="siao.people"
                        :label="labels.siao.people"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>

            <FormParagraph title="de logements sociaux" size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="logement_social.families"
                        :label="labels.logement_social.families"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        class="ml-4"
                        name="logement_social.people"
                        :label="labels.logement_social.people"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>

            <FormParagraph title="DALO" size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="dalo.families"
                        :label="labels.dalo.families"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        class="ml-4"
                        name="dalo.people"
                        :label="labels.dalo.people"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>
        </FormParagraph>

        <FormParagraph title="Nombre d'accès à...">
            <FormParagraph title="un logement, accompagné / adapté" size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="accompagnes.families"
                        :label="labels.accompagnes.families"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        class="ml-4"
                        name="accompagnes.people"
                        :label="labels.accompagnes.people"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>

            <FormParagraph title="un logement, sans accompagnement" size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="non_accompagnes.families"
                        :label="labels.non_accompagnes.families"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        name="non_accompagnes.people"
                        class="ml-4"
                        :label="labels.non_accompagnes.people"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>

            <FormParagraph title="un hébergement" size="lg">
                <div class="flex">
                    <FormMiseAJourIndicateursTextInput
                        name="heberges.families"
                        :label="labels.heberges.families"
                    ></FormMiseAJourIndicateursTextInput>
                    <FormMiseAJourIndicateursTextInput
                        name="heberges.people"
                        :label="labels.heberges.people"
                        class="ml-4"
                    ></FormMiseAJourIndicateursTextInput>
                </div>
            </FormParagraph>
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import labels from "../FormMiseAJourIndicateurs.labels";

import FormMiseAJourIndicateursTextInput from "../inputs/FormMiseAJourIndicateursTextInput.vue";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
</script>
