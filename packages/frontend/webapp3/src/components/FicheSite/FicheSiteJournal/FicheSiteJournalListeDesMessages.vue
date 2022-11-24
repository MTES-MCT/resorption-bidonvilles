<template>
    <section>
        <h1 class="text-lg font-bold mb-2">
            {{ comments.length }} message{{ comments.length > 1 ? "s" : "" }}
        </h1>

        <CarteCommentaire
            v-for="comment in comments"
            :key="comment.id"
            :id="`message${comment.id}`"
            :comment="comment"
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
</script>
