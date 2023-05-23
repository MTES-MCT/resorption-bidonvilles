<template>
    <section>
        <CarteCommentaire
            v-for="comment in comments"
            :key="comment.id"
            :id="`message${comment.id}`"
            :comment="comment"
            :onAttachmentDelete="onAttachmentDelete"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";

const props = defineProps({
    comments: Array,
});
const { comments } = toRefs(props);

function onAttachmentDelete() {
    console.log("On supprime un attachment d'action");
}
</script>
