<template>
    <section>
        <FicheSiteJournalGroupeCommentaire
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
        />
    </section>
</template>

<script setup>
import { toRefs } from "vue";
import FicheSiteJournalGroupeCommentaire from "./FicheSiteJournalGroupeCommentaire.vue";
const props = defineProps({
    comments: Array,
});
const { comments } = toRefs(props);
</script>
