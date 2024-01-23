<template>
    <div class="bg-blue200 py-6">
        <ContentWrapper>
            <h2 class="text-xl font-bold mb-4" id="reponses">
                <Icon icon="comment" /> Section des réponses —
                {{ question.answers.length }} réponse{{
                    question.answers.length > 1 ? "s" : ""
                }}
            </h2>
            <FicheQuestionNouvelleReponse :question="question" class="mb-2" />

            <section class="mt-4 mb-4">
                <p class="text-lg font-bold">
                    {{ question.answers.length }} réponse{{
                        question.answers.length > 1 ? "s" : ""
                    }}
                </p>
                <FicheQuestionSubscriptionButton
                    :question="question"
                    class="mt-2 mb-6"
                />
                <FicheQuestionListeDesReponses
                    v-if="question.answers.length > 0"
                    :answers="question.answers"
                    :questionId="question.id"
                />
                <p v-else>Cette question n'a pas encore reçu de réponses.</p>
            </section>
        </ContentWrapper>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import FicheQuestionNouvelleReponse from "./FicheQuestionNouvelleReponse/FicheQuestionNouvelleReponse.vue";
import FicheQuestionListeDesReponses from "./FicheQuestionListeDesReponses.vue";
import FicheQuestionSubscriptionButton from "../FicheQuestionSubscriptionButton/FicheQuestionSubscriptionButton.vue";
import {} from "@resorptionbidonvilles/ui";
import { ContentWrapper, Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
