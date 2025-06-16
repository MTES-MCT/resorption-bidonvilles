<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        showModeration
        allowAttachmentDeletion
        @moderate="openModerationModal"
        @deleteAttachment="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";
import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";
import { useAttachmentsStore } from "@/stores/attachments.store";
import { useModaleStore } from "@/stores/modale.store";

const props = defineProps({
    actionId: {
        type: Number,
        required: true,
    },
    comment: {
        type: Object,
        required: true,
    },
});
const { actionId, comment } = toRefs(props);

function openModerationModal() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModaleModerationCommentaire, {
        comment: { ...comment.value, actionId: actionId.value },
        commentType: "action",
    });
}

// on définit la méthode pour supprimer un attachment
function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteActionCommentAttachment(file, {
        actionId: actionId.value,
        commentId: comment.value.id,
    });
}
</script>
