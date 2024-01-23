<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        showModeration
        allowAttachmentDeletion
        @moderate="openModerationModal"
        @deleteAttachment="onDeleteAttachment"
    />
    <ModaleModerationCommentaire ref="moderationModal" :comment="comment" />
</template>

<script setup>
import { ref, toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";
import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";
import { useAttachmentsStore } from "@/stores/attachments.store";

const props = defineProps({
    townId: {
        type: Number,
        required: true,
    },
    comment: {
        type: Object,
        required: true,
    },
});
const { townId, comment } = toRefs(props);
const moderationModal = ref(null);

function openModerationModal() {
    moderationModal.value.open();
}

function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteShantytownCommentAttachment(file, {
        townId: townId.value,
        commentId: comment.value.id,
    });
}
</script>
