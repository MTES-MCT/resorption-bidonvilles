<template>
    <FicheQuestionHeader :plan="plan" />

    <ContentWrapper>
        <FicheQuestionTags class="mb-4" :question="question" />
        <FicheQuestionTitre class="mb-4" :question="question" />
        <FicheQuestionAuthor class="mb-4" :author="question.createdBy" />
        <FicheQuestionDetails class="mb-2" :question="question" />
        <FicheQuestionDate class="mb-4" :question="question" />
    </ContentWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FicheQuestionHeader from "./FicheQuestionHeader/FicheQuestionHeader.vue";
import FicheQuestionTags from "./FicheQuestionTags/FicheQuestionTags.vue";
import FicheQuestionTitre from "./FicheQuestionTitre/FicheQuestionTitre.vue";
import FicheQuestionAuthor from "./FicheQuestionAuthor/FicheQuestionAuthor.vue";
import FicheQuestionDetails from "./FicheQuestionDetails/FicheQuestionDetails.vue";
import FicheQuestionDate from "./FicheQuestionDate/FicheQuestionDate.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
