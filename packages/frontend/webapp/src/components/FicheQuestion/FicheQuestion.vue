<template>
    <ContentWrapper>
        <FicheQuestionHeader :question="question" />
        <FicheQuestionTags
            :question="question"
            v-if="question.tags.length > 0"
            class="-mt-4 mb-4"
        />
        <FicheQuestionDetails class="mb-4" :question="question" />
        <FicheQuestionDate :question="question" />
    </ContentWrapper>

    <FicheQuestionReponses :question="question" class="px-10 mt-10" />
</template>

<script setup>
import { toRefs } from "vue";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FicheQuestionHeader from "./FicheQuestionHeader/FicheQuestionHeader.vue";
import FicheQuestionTags from "./FicheQuestionTags/FicheQuestionTags.vue";
import FicheQuestionDetails from "./FicheQuestionDetails/FicheQuestionDetails.vue";
import FicheQuestionDate from "./FicheQuestionDate/FicheQuestionDate.vue";
import FicheQuestionReponses from "./FicheQuestionReponses/FicheQuestionReponses.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);
</script>
