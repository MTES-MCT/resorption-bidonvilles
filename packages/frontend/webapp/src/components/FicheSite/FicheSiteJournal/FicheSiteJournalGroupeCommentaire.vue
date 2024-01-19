<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        showModeration
        @moderate="openModerationModal"
    />
    <ModaleModerationCommentaire ref="moderationModal" :comment="comment" />
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";
import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";

const props = defineProps({
    comment: Object,
});
const moderationModal = ref(null);

const { comment } = toRefs(props);

function openModerationModal() {
    moderationModal.value.open();
}
</script>
