<template>
    <section>
        <CarteCommentaireSite
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaireSite from "@/components/CarteCommentaire/CarteCommentaireSite.vue";

const props = defineProps({
    comments: Array,
});
const { comments } = toRefs(props);
</script>
