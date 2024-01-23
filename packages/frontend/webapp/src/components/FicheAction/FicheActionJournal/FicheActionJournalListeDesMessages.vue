<template>
    <section>
        <CarteCommentaireAction
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaireAction from "@/components/CarteCommentaire/CarteCommentaireAction.vue";

const props = defineProps({
    comments: Array,
});
const { comments } = toRefs(props);
</script>
