<template>
    <section>
        <CarteCommentaireAction
            v-for="comment in comments"
            :key="comment.id"
            :actionId="actionId"
            :comment="comment"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaireAction from "@/components/CarteCommentaire/CarteCommentaireAction.vue";

const props = defineProps({
    actionId: Number,
    comments: Array,
});
const { actionId, comments } = toRefs(props);
</script>
