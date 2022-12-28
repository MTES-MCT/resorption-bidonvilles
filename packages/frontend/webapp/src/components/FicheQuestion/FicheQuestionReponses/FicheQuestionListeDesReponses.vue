<template>
    <section>
        <CarteCommentaire
            v-for="answer in answers"
            :key="answer.id"
            :id="`message${answer.id}`"
            :comment="answer"
        />
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";

const props = defineProps({
    answers: Array,
});
const { answers } = toRefs(props);
</script>
