<template>
    <FormSection id="contacts">
        <template v-slot:title>Contacts</template>

        <FormParagraph title="Quels sont les contacts ?">
            <InputManagers :disable="disableManagers" />
            <InputOperators />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FormSection from "@/components/FormSection/FormSection.vue";
import { FormParagraph } from "@resorptionbidonvilles/ui";
import InputManagers from "../inputs/FormDeclarationActionInputManagers.vue";
import InputOperators from "../inputs/FormDeclarationActionInputOperators.vue";

const props = defineProps({
    disableManagers: Boolean,
});
const { disableManagers } = toRefs(props);
</script>
