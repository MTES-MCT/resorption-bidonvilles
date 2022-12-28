<template>
    <div class="bg-blue200 py-10">
        <FicheQuestionNouvelleReponse :question="question" class="mb-12" />

        <h1 class="text-lg font-bold mb-2">
            {{ question.answers.length }} réponse{{
                question.answers.length > 1 ? "s" : ""
            }}
        </h1>
        <FicheQuestionListeDesReponses
            :answers="question.answers"
            v-if="question.answers.length > 0"
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheQuestionNouvelleReponse from "./FicheQuestionNouvelleReponse/FicheQuestionNouvelleReponse.vue";
import FicheQuestionListeDesReponses from "./FicheQuestionListeDesReponses.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
