<template>
    <Button
        icon="trash"
        iconPosition="left"
        type="button"
        variant="primary"
        :loading="questionStore.pendingDeletions[questionId] === true"
        @click="emit('showModale')"
        class="flex-shrink-0"
        >Supprimer la question</Button
    >
</template>

<script setup>
import { toRefs } from "vue";
import { useQuestionsStore } from "@/stores/questions.store";
import { Button } from "@resorptionbidonvilles/ui";

const props = defineProps({
    questionId: {
        type: Number,
        required: true,
    },
});

const { questionId } = toRefs(props);
const questionStore = useQuestionsStore();

const emit = defineEmits(["showModale"]);
</script>
