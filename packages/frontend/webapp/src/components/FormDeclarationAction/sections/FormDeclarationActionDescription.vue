<template>
    <FormSection id="description">
        <template v-slot:title>Description de l'action</template>

        <FormParagraph :title="labels.name">
            <InputName />
        </FormParagraph>

        <FormParagraph
            title="Quelles sont les dates et les objectifs de l'action ?"
        >
            <InputDates />
            <InputTopics />
            <InputGoals />
        </FormParagraph>

        <FormParagraph :title="labels.location_type" showMandatoryStar>
            <InputLocationDepartement />
            <InputLocationType />
            <InputLocationAutre v-if="values.location_type === 'autre'" />
            <InputLocationETI v-else-if="values.location_type === 'eti'" />
            <InputLocationShantytowns
                v-else-if="values.location_type === 'sur_site'"
            />
        </FormParagraph>

        <FormParagraph title="Quels sont les contacts ?">
            <InputManagers />
            <InputOperators />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { useFormValues } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
import labels from "../FormDeclarationAction.labels";

import InputName from "../inputs/FormDeclarationActionInputName.vue";
import InputDates from "../inputs/FormDeclarationActionInputDates.vue";
import InputTopics from "../inputs/FormDeclarationActionInputTopics.vue";
import InputGoals from "../inputs/FormDeclarationActionInputGoals.vue";
import InputLocationType from "../inputs/FormDeclarationActionInputLocationType.vue";
import InputLocationDepartement from "../inputs/FormDeclarationActionInputLocationDepartement.vue";
import InputLocationAutre from "../inputs/FormDeclarationActionInputLocationAutre.vue";
import InputLocationETI from "../inputs/FormDeclarationActionInputLocationETI.vue";
import InputLocationShantytowns from "../inputs/FormDeclarationActionInputLocationShantytowns.vue";
import InputManagers from "../inputs/FormDeclarationActionInputManagers.vue";
import InputOperators from "../inputs/FormDeclarationActionInputOperators.vue";

const values = useFormValues();
</script>
