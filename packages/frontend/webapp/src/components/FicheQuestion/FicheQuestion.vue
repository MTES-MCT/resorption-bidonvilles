<template>
    <ContentWrapper>
        <FicheQuestionHeader :question="question" />
        <FicheQuestionDetails class="mb-4" :question="question" />
        <FicheQuestionAttachments
            v-if="question.attachments.length > 0"
            class="my-3"
            :attachments="question.attachments"
            entityType="question"
            :entityId="question.id"
            :disallowAttachmentsRemoval="!canUserDeleteQuestionAttachment"
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

const canUserDeleteQuestionAttachment = computed(() => {
    const userStore = useUserStore();
    return (
        userStore.user.is_superuser ||
        userStore.user.id === question.value.createdBy.id
    );
});
</script>
