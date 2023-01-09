<template>
    <FormSection id="emploi">
        <template v-slot:title>Formation et emploi</template>

        <FormParagraph title="Nombre de personnes inscrites ou suivies par">
            <FormParagraph title="Pôle Emploi" size="lg">
                <div class="flex items-center">
                    <FormMiseAJourIndicateursTextInput name="pole_emploi" />
                    <span class="mx-2">dont</span>
                    <FormMiseAJourIndicateursTextInput
                        name="pole_emploi_femmes"
                    />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="Mission locale" size="lg">
                <div class="flex items-center">
                    <FormMiseAJourIndicateursTextInput name="mission_locale" />
                    <span class="mx-2">dont</span>
                    <FormMiseAJourIndicateursTextInput
                        name="mission_locale_femmes"
                    />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>
        </FormParagraph>

        <FormParagraph title="Nombre de personnes ayant">
            <FormParagraph title="un contrat" size="lg">
                <div class="flex items-center">
                    <FormMiseAJourIndicateursTextInput name="contrats" />
                    <span class="mx-2">dont</span>
                    <FormMiseAJourIndicateursTextInput name="contrats_femmes" />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="une formation" size="lg">
                <div class="flex items-center">
                    <FormMiseAJourIndicateursTextInput name="formations" />
                    <span class="mx-2">dont</span>
                    <FormMiseAJourIndicateursTextInput
                        name="formations_femmes"
                    />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="un statut autoentrepreneur" size="lg">
                <div class="flex items-center">
                    <FormMiseAJourIndicateursTextInput
                        name="autoentrepreneurs"
                    />
                    <span class="mx-2">dont</span>
                    <FormMiseAJourIndicateursTextInput
                        name="autoentrepreneurs_femmes"
                    />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>

            <FormParagraph title="l'ARE" size="lg">
                <div class="flex items-center">
                    <FormMiseAJourIndicateursTextInput name="are" />
                    <span class="mx-2">dont</span>
                    <FormMiseAJourIndicateursTextInput name="are_femmes" />
                    <span class="ml-2">femmes</span>
                </div>
            </FormParagraph>
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import FormMiseAJourIndicateursTextInput from "../inputs/FormMiseAJourIndicateursTextInput.vue";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
</script>
