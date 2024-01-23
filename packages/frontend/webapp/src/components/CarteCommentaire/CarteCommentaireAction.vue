<template>
    <CarteCommentaire
        :id="`message${comment.id}`"
        :comment="comment"
        @deleteAttachment="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";

const props = defineProps({
    comment: {
        type: Object,
        required: true,
    },
});
const { comment } = toRefs(props);

// on définit la méthode pour supprimer un attachment
function onDeleteAttachment(file, index) {}
</script>
