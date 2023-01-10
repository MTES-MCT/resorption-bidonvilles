<template>
    <div
        class="flex justify-between h-14 items-center mr-4 space-x-4 print:hidden"
    >
        <CarteQuestiondateCreation :question="question" />
        <template v-if="questionHasAtLeastOneAnswer">
            <div class="flex justify-end items-center space-x-4">
                <Button
                    variant="primary"
                    size="sm"
                    icon="rectangle-list"
                    iconPosition="left"
                    :href="`/question/${question.id}`"
                    >Répondre</Button
                >
                <Button
                    variant="primary"
                    size="sm"
                    icon="fa-regular fa-eye"
                    iconPosition="left"
                    :href="`/question/${question.id}`"
                    >Voir toutes les réponses</Button
                >
            </div>
        </template>
        <Button
            v-else
            variant="primary"
            size="sm"
            icon="rectangle-list"
            iconPosition="left"
            :href="`/question/${question.id}`"
            >Soyez le premier à répondre</Button
        >
    </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import CarteQuestiondateCreation from "./CarteQuestionDateCreation.vue";

const props = defineProps({
    question: Object,
    isHover: {
        type: Boolean,
        default: false,
    },
});
const { question } = toRefs(props);

const questionHasAtLeastOneAnswer = computed(() => {
    if (question.value.answers) {
        return question.value.answers.length > 0;
    }
    return false;
});
</script>
