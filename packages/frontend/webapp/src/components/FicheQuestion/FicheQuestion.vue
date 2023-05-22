<template>
    <ContentWrapper>
        <FicheQuestionHeader :question="question" />
        <FicheQuestionDetails class="mb-4" :question="question" />
        <FicheQuestionAttachments
            v-if="question.attachments"
            class="my-3"
            :attachments="question.attachments"
        />
        <FicheQuestionDate :question="question" />
    </ContentWrapper>

    <FicheQuestionReponses :question="question" class="px-10 mt-10" />
</template>

<script setup>
import { defineProps, onMounted, toRefs } from "vue";
import router from "@/helpers/router";

import { ContentWrapper } from "@resorptionbidonvilles/ui";
import FicheQuestionHeader from "./FicheQuestionHeader/FicheQuestionHeader.vue";
import FicheQuestionDetails from "./FicheQuestionDetails/FicheQuestionDetails.vue";
import FicheQuestionDate from "./FicheQuestionDate/FicheQuestionDate.vue";
import FicheQuestionReponses from "./FicheQuestionReponses/FicheQuestionReponses.vue";
import FicheQuestionAttachments from "./FicheQuestionAttachments/FicheQuestionAttachments.vue";
import { useQuestionsStore } from "@/stores/questions.store";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);

onMounted(() => {
    if (router.currentRoute.value.query.abonnement === "oui") {
        const questionStore = useQuestionsStore();
        questionStore.subscribe(question.value.id);
    }
});
</script>
