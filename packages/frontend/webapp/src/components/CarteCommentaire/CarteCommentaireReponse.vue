<template>
    <CarteCommentaire
        :id="`reponse${answer.id}`"
        :comment="answer"
        @deleteAttachment="onDeleteAttachment"
    />
</template>

<script setup>
import { toRefs } from "vue";
import CarteCommentaire from "./CarteCommentaire.vue";

const props = defineProps({
    answer: {
        type: Object,
        required: true,
    },
});
const { answer } = toRefs(props);

// on définit la méthode pour supprimer un attachment
function onDeleteAttachment(file, index) {
    console.log("deleting from answer store", file, index);
}
</script>
