<template>
    <section>
        <CarteCommentaireSite
            v-for="comment in comments"
            :key="comment.id"
            :townId="townId"
            :comment="comment"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaireSite from "@/components/CarteCommentaire/CarteCommentaireSite.vue";

const props = defineProps({
    comments: Array,
    townId: Number,
});
const { comments, townId } = toRefs(props);
</script>
