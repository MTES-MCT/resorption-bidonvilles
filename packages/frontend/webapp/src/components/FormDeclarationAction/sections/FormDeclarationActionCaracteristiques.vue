<template>
    <FormSection id="intervention">
        <template v-slot:title>Intervention</template>

        <FormParagraph :title="labels.name">
            <InputName />
        </FormParagraph>

        <FormParagraph
            title="Quelles sont les dates et les objectifs de l'action ?"
        >
            <InputDates :mode="mode" />
            <p v-if="mode === 'edit'" class="-mt-4 mb-6 italic">
                L'action sera considérée comme terminée et apparaîtra
                automatiquement dans l'onglet 'Actions terminées' à compter de
                la date de fin renseignée ci-dessus
            </p>
            <InputTopics />
            <InputGoals />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationAction.labels";

import InputName from "../inputs/FormDeclarationActionInputName.vue";
import InputDates from "../inputs/FormDeclarationActionInputDates.vue";
import InputTopics from "../inputs/FormDeclarationActionInputTopics.vue";
import InputGoals from "../inputs/FormDeclarationActionInputGoals.vue";
import { defineProps, toRefs } from "vue";

const props = defineProps({
    mode: {
        type: String,
        required: true,
    },
});
const { mode } = toRefs(props);
</script>
