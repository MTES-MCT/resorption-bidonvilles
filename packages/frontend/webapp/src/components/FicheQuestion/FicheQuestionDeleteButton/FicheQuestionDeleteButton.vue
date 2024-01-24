<template>
    <Button
        icon="trash"
        iconPosition="left"
        type="button"
        variant="primary"
        :loading="questionStore.pendingDeletions[question.id] === true"
        @click="openModerationModale"
        class="flex-shrink-0"
        >Supprimer la question</Button
    >
</template>

<script setup>
import { toRefs } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";
import { Button } from "@resorptionbidonvilles/ui";
import { useModaleStore } from "@/stores/modale.store";
import ModaleModerationQuestion from "@/components/ModaleModerationQuestion/ModaleModerationQuestion.vue";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});

const { question } = toRefs(props);
const questionStore = useQuestionsStore();

function openModerationModale() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModaleModerationQuestion, {
        question: question.value,
    });
}
</script>
