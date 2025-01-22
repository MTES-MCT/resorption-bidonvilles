<template>
    <div class="flex justify-between h-14 items-center space-x-4 print:hidden">
        <CarteQuestiondateCreation :question="question" />
        <div class="flex justify-end items-center space-x-4">
            <Button
                :aria-label="`Voir la question ${question.question}`"
                variant="primary"
                size="sm"
                icon="rectangle-list"
                iconPosition="left"
                :href="`/question/${question.id}`"
                class="!border-2 !border-primary hover:!bg-primaryDark"
                >Voir la question</Button
            >
            <Button
                :aria-label="`Voir les ${seeAnswerWording}`"
                v-if="questionHasAtLeastOneAnswer"
                variant="primary"
                size="sm"
                icon="fa-regular fa-eye"
                iconPosition="left"
                :href="`/question/${question.id}#reponses`"
                class="!border-2 !border-primary hover:!bg-primaryDark"
                >{{ seeAnswerWording }}</Button
            >
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import CarteQuestiondateCreation from "./CarteQuestionDateCreation.vue";

const props = defineProps({
    question: Object,
});
const { question } = toRefs(props);

const questionHasAtLeastOneAnswer = computed(() => {
    if (question.value.answers) {
        return question.value.answers.length > 0;
    }
    return false;
});

const seeAnswerWording = computed(() => {
    return question.value.answers.length > 1
        ? `${question.value.answers.length} réponses`
        : `${question.value.answers.length} réponse`;
});
</script>

<style scoped>
button {
    border: inherit;
}
</style>
