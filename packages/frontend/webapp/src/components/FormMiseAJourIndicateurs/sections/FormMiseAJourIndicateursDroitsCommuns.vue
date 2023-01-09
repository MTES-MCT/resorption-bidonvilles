<template>
    <FormSection id="droits_communs">
        <template v-slot:title>Droits communs et ressources</template>

        <FormParagraph title="Nombre de personnes avec...">
            <FormMiseAJourIndicateursTextInput
                name="domiciliation"
                label="une domiciliation"
            />
            <FormMiseAJourIndicateursTextInput
                name="droits_caf"
                label="des droits CAF ouverts"
            />
            <FormMiseAJourIndicateursTextInput
                name="emploi_stable"
                label="un emploi stable / ressources suffisantes"
            />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
import FormMiseAJourIndicateursTextInput from "../inputs/FormMiseAJourIndicateursTextInput.vue";
</script>
