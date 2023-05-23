<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        :showActionIcons="true"
        @moderate="openModerationModal"
        :onAttachmentDelete="onAttachmentDelete"
    />
    <ModaleModerationCommentaire ref="moderationModal" :comment="comment" />
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";
import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";
import { useTownsStore } from "@/stores/towns.store";

const props = defineProps({
    comment: Object,
});
const moderationModal = ref(null);

const { comment } = toRefs(props);

function openModerationModal() {
    moderationModal.value.open();
}

function onAttachmentDelete(attachment) {
    const townsStore = useTownsStore();
    townsStore.deleteCommentAttachment(
        comment.value.shantytown,
        comment.value.id,
        attachment.id
    );
}
</script>
