<template>
    <FicheQuestionHeader />
    <FicheQuestionTags class="mb-2" :question="question" />
    <FicheQuestionTitre class="mb-2" :question="question" />
    <FicheQuestionAuthor class="mb-2" :author="question.createdBy" />
    <FicheQuestionDetails class="mb-4" :question="question" />
    <FicheQuestionDate :question="question" />
    <FicheQuestionReponses :question="question" class="px-10 mt-10" />
</template>

<script setup>
import { defineProps, toRefs } from "vue";

// import FicheQuestionWrapper from "./FicheQuestionWrapper.vue";
import FicheQuestionHeader from "./FicheQuestionHeader/FicheQuestionHeader.vue";
import FicheQuestionTags from "./FicheQuestionTags/FicheQuestionTags.vue";
import FicheQuestionTitre from "./FicheQuestionTitre/FicheQuestionTitre.vue";
import FicheQuestionAuthor from "./FicheQuestionAuthor/FicheQuestionAuthor.vue";
import FicheQuestionDetails from "./FicheQuestionDetails/FicheQuestionDetails.vue";
import FicheQuestionDate from "./FicheQuestionDate/FicheQuestionDate.vue";
import FicheQuestionReponses from "./FicheQuestionReponses/FicheQuestionReponses.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
