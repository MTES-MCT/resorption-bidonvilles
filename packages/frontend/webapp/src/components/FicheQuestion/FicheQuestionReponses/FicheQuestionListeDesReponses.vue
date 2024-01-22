<template>
    <section>
        <CarteCommentaire
            v-for="answer in enrichedAnswers"
            :key="answer.id"
            :id="`reponse${answer.id}`"
            :comment="answer"
            :entityId="questionId"
            entityType="answer"
            :disallowAttachmentsRemoval="!answer.isAllowedToDeleteAttachment"
        />
    </section>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";
import { useUserStore } from "@/stores/user.store";

const props = defineProps({
    answers: Array,
    questionId: Number,
});
const { answers, questionId } = toRefs(props);

const enrichedAnswers = computed(() => {
    return answers.value.map((answer) => {
        return {
            ...answer,
            isAllowedToDeleteAttachment: canUserDeleteAnswerAttachment(
                answer.createdBy.id
            ),
        };
    });
});

function canUserDeleteAnswerAttachment(ownerId) {
    const userStore = useUserStore();
    return userStore.user.is_superuser || userStore.user.id === ownerId;
}
</script>
