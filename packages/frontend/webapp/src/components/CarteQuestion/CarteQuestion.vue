<template>
    <article
        class="rounded border-1 border-blue300 px-4 pb-4 cursor-pointer hover:bg-blue200 flex flex-col"
        @click="routeToDetailedQuestion"
    >
        <CarteQuestionQuestion :question="question.question" />
        <CarteQuestionAuteurOrganisation :auteur="question.createdBy" />

        <h2 class="text-sm mt-2">
            {{ question.details }}
        </h2>
        <main class="mb-4"></main>

        <CarteQuestionFooter :question="question.question" />
    </article>
</template>

<script setup>
import { toRefs } from "vue";
import CarteQuestionQuestion from "./CarteQuestionQuestion.vue";
import CarteQuestionAuteurOrganisation from "./CarteQuestionAuteurOrganisation.vue";
import CarteQuestionFooter from "./CarteQuestionFooter.vue";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);
</script>
