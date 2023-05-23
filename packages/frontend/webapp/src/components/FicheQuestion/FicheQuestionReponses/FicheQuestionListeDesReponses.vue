<template>
    <section>
        <CarteCommentaire
            v-for="answer in answers"
            :key="answer.id"
            :id="`reponse${answer.id}`"
            :comment="answer"
            :onAttachmentDelete="onAttachmentDelete"
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

function onAttachmentDelete() {
    console.log("On supprime un attachment de réponse");
}
</script>
