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
import { ref, toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";
import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";

const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
});
const { comment } = toRefs(props);
const moderationModal = ref(null);

function openModerationModal() {
    moderationModal.value.open();
}
</script>
