<template>
    <TextInput
        name="question"
        id="question"
        :value="question"
        info="Résumez votre question à une courte phrase à destination de la communauté, vous pourrez détailler votre question plus bas."
        maxlength="255"
    />
</template>

<script setup>
import { toRefs } from "vue";

import { TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: {
        type: String,
        required: false,
        default: "",
    },
});

const { question } = toRefs(props);
</script>
