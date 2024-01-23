<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        allowAttachmentDeletion
        @deleteAttachment="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";
import { useAttachmentsStore } from "@/stores/attachments.store";

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

// on définit la méthode pour supprimer un attachment
function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteActionCommentAttachment(file, {
        actionId: actionId.value,
        commentId: comment.value.id,
    });
}
</script>
