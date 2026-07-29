<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        showModeration
        allowAttachmentDeletion
        @moderate="openModerationModal"
        @deleteAttachment="onDeleteAttachment"
        :onUpdate="onUpdateComment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";
import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";
import { useAttachmentsStore } from "@/stores/attachments.store";
import { useModaleStore } from "@/stores/modale.store";
import { useTownsStore } from "@/stores/towns.store";

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

const townsStore = useTownsStore();

function openModerationModal() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModaleModerationCommentaire, {
        comment: comment.value,
        commentType: "shantytown",
    });
}

function onDeleteAttachment(file) {
    const attachmentStore = useAttachmentsStore();
    attachmentStore.deleteShantytownCommentAttachment(file, {
        townId: townId.value,
        commentId: comment.value.id,
    });
}

async function onUpdateComment(commentId, description) {
    await townsStore.updateComment(townId.value, commentId, description);
}
</script>
