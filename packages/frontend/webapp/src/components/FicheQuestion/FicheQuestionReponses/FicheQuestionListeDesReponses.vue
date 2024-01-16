<template>
    <section>
        <CarteCommentaire
            v-for="answer in answers"
            :key="answer.id"
            :id="`reponse${answer.id}`"
            :comment="answer"
            :entityId="questionId"
            entityType="answer"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";

const props = defineProps({
    answers: Array,
    questionId: Number,
});
const { answers, questionId } = toRefs(props);
</script>
