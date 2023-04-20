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
import { toRefs } from "vue";

const props = defineProps({
    mode: {
        type: String,
        required: true,
    },
});
const { mode } = toRefs(props);
</script>
