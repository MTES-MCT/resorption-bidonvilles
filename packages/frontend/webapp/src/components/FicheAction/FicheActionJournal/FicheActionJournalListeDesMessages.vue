<template>
    <section>
        <CarteCommentaire
            v-for="comment in comments"
            :key="comment.id"
            :id="`message${comment.id}`"
            :comment="comment"
        />
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";

const props = defineProps({
    comments: Array,
});
const { comments } = toRefs(props);
</script>
