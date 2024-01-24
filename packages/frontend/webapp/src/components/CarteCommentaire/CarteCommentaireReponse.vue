<template>
    <CarteCommentaire
        :id="`reponse${answer.id}`"
        :comment="answer"
        showModeration
        allowAttachmentDeletion
        @deleteAttachment="onDeleteAttachment"
        @moderate="showModerationModal"
    />
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";
import ModaleModerationReponse from "@/components/ModaleModerationReponse/ModaleModerationReponse.vue";
import { useAttachmentsStore } from "@/stores/attachments.store";
import { useModaleStore } from "@/stores/modale.store";

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

function showModerationModal() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModaleModerationReponse, { answer });
}
</script>
