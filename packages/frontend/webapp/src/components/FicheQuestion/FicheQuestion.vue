<template>
    <ContentWrapper>
        <FicheQuestionHeader :question="question" />
        <FicheQuestionDetails class="mb-4" :question="question" />
        <FicheQuestionAttachments
            v-if="question.attachments.length > 0"
            class="my-3"
            :questionId="question.id"
            :canModerate="canModerate"
            :attachments="question.attachments"
        />
        <FicheQuestionDate :question="question" />
    </ContentWrapper>

    <FicheQuestionReponses :question="question" class="px-10 mt-10" />
</template>

<script setup>
import { computed, defineProps, onMounted, toRefs } from "vue";
import router from "@/helpers/router";

import { ContentWrapper } from "@resorptionbidonvilles/ui";
import FicheQuestionHeader from "./FicheQuestionHeader/FicheQuestionHeader.vue";
import FicheQuestionDetails from "./FicheQuestionDetails/FicheQuestionDetails.vue";
import FicheQuestionDate from "./FicheQuestionDate/FicheQuestionDate.vue";
import FicheQuestionReponses from "./FicheQuestionReponses/FicheQuestionReponses.vue";
import FicheQuestionAttachments from "./FicheQuestionAttachments/FicheQuestionAttachments.vue";
import { useQuestionsStore } from "@/stores/questions.store";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "@/stores/config.store";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);

const canModerate = computed(() => {
    const userStore = useUserStore();
    const configStore = useConfigStore();
    return (
        userStore.hasPermission("data.moderate") ||
        question.value.createdBy.id === configStore.config.user.id
    );
});

onMounted(() => {
    if (router.currentRoute.value.query.abonnement === "oui") {
        const questionStore = useQuestionsStore();
        questionStore.subscribe(question.value.id);
    }
});
</script>
