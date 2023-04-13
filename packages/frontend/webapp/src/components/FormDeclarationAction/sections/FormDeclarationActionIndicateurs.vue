<template>
    <FormSection id="indicateurs">
        <template v-slot:title>Indicateurs</template>
        <FormActionIndicateursInfo />
        <InputIndicateurs
            name="indicateurs"
            :minYear="minYear"
            :maxYear="maxYear"
            :topics="topics"
        />
    </FormSection>
</template>

<script setup>
import { computed } from "vue";
import { useFieldValue } from "vee-validate";
import FormSection from "@/components/FormSection/FormSection.vue";

import InputIndicateurs from "@/components/InputIndicateurs/InputIndicateurs.vue";
import FormActionIndicateursInfo from "./FormDeclarationActionIndicateursInfo.vue";

const topics = useFieldValue("topics");

const startedAt = useFieldValue("started_at");
const minYear = computed(() => {
    return startedAt.value
        ? startedAt.value.getFullYear()
        : new Date().getFullYear();
});

const endedAt = useFieldValue("ended_at");
const maxYear = computed(() => {
    return endedAt.value
        ? Math.min(endedAt.value.getFullYear(), new Date().getFullYear())
        : new Date().getFullYear();
});
</script>
