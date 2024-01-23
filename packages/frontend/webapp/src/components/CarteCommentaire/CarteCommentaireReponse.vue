<template>
    <CarteCommentaire
        :id="`reponse${answer.id}`"
        :comment="answer"
        allowAttachmentDeletion
        @deleteAttachment="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";
import { useAttachmentsStore } from "@/stores/attachments.store";

const props = defineProps({
    questionId: {
        type: Number,
        required: true,
    },
    answer: {
        type: Object,
        required: true,
    },
});
const { answer, questionId } = toRefs(props);

function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteAnswerAttachment(file, {
        questionId: questionId.value,
        answerId: answer.value.id,
    });
}
</script>
