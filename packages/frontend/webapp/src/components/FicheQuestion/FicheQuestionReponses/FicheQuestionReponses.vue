<template>
    <div class="bg-blue200">
        <FicheQuestionNouvelleReponse :question="question" class="mb-12" />

        <h1 class="text-lg font-bold mb-2">
            {{ questionHasAtLeastOneAnswer ? question.answers.length : "0" }}
            réponse{{
                questionHasAtLeastOneAnswer
                    ? question.answers.length > 1
                        ? "s"
                        : ""
                    : ""
            }}
        </h1>
        <FicheQuestionListeDesReponses
            :answers="question.answers"
            v-if="questionHasAtLeastOneAnswer"
        />
    </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";

import FicheQuestionNouvelleReponse from "./FicheQuestionNouvelleReponse/FicheQuestionNouvelleReponse.vue";
import FicheQuestionListeDesReponses from "./FicheQuestionListeDesReponses.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);

const questionHasAtLeastOneAnswer = computed(() => {
    if (question.value.answers) {
        return question.value.answers.length > 0;
    }
    return false;
});
</script>
