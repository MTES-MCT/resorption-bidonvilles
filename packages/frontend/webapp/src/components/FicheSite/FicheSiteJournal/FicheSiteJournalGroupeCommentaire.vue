<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        :entityId="townId"
        :showActionIcons="true"
        @moderate="openModerationModal"
        entityType="shantytown_comment"
    />
    <ModaleModerationCommentaire ref="moderationModal" :comment="comment" />
</template>

<script setup>
import { defineProps, toRefs, ref } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";
import ModaleModerationCommentaire from "@/components/ModaleModerationCommentaire/ModaleModerationCommentaire.vue";

const props = defineProps({
    comment: Object,
    townId: Number,
});
const moderationModal = ref(null);

const { comment, townId } = toRefs(props);

function openModerationModal() {
    moderationModal.value.open();
}
</script>
