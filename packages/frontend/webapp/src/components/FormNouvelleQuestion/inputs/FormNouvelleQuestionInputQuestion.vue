<template>
    <TextInput
        name="question"
        id="question"
        :value="question.question"
        info="Résumez votre question à une courte phrase à destination de la communauté, vous pourrez détailler votre question plus bas."
        maxlength="255"
        :disabled="disabled"
    />
</template>

<script setup>
import { toRefs } from "vue";

import { TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    disabled: Boolean,
    question: {
        type: String,
        required: false,
        default: "",
    },
});

const { question, disabled } = toRefs(props);
</script>
