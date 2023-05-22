<template>
    <div class="bg-blue200 py-6">
        <ContentWrapper>
            <h1 class="text-xl font-bold mb-4" id="reponses">
                <Icon icon="comment" /> Section des réponses —
                {{ question.answers.length }} réponse{{
                    question.answers.length > 1 ? "s" : ""
                }}
            </h1>
            <FicheQuestionNouvelleReponse :question="question" class="mb-2" />

            <section class="mt-6 mb-4">
                <h1 class="text-lg font-bold">
                    {{ question.answers.length }} réponse{{
                        question.answers.length > 1 ? "s" : ""
                    }}
                </h1>
                <FicheQuestionSubscriptionButton
                    :question="question"
                    class="mt-2 mb-6"
                />
                <FicheQuestionListeDesReponses
                    v-if="question.answers.length > 0"
                    :answers="question.answers"
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
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
