<template>
    <section>
        <FicheSiteJournalGroupeCommentaire
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :townId="townId"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import FicheSiteJournalGroupeCommentaire from "./FicheSiteJournalGroupeCommentaire.vue";
const props = defineProps({
    comments: Array,
    townId: Number,
});
const { comments, townId } = toRefs(props);
</script>
