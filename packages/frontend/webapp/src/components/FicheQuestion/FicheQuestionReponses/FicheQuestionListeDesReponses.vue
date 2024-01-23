<template>
    <section>
        <CarteCommentaireReponse
            v-for="answer in answers"
            :key="answer.id"
            :answer="answer"
            :questionId="questionId"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaireReponse from "@/components/CarteCommentaire/CarteCommentaireReponse.vue";

const props = defineProps({
    answers: Array,
    questionId: Number,
});
const { answers, questionId } = toRefs(props);
</script>
