<template>
    <Button
        icon="envelope"
        iconPosition="left"
        type="button"
        @click="submit"
        :loading="isLoading"
        >{{ wording }}</Button
    >
</template>

<script setup>
import { toRefs, computed } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";
import { useQuestionsStore } from "@/stores/questions.store";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});
const { question } = toRefs(props);

const userStore = useUserStore();
const questionStore = useQuestionsStore();
const isSubscribed = computed(() => {
    return userStore.user.question_subscriptions[question.value.id] === true;
});

const wording = computed(() => {
    return isSubscribed.value === true
        ? "Ne plus recevoir les réponses par courriel"
        : "Recevoir les réponses par courriel";
});

const isLoading = computed(() => {
    return questionStore.subscriptions[question.value.id] === true;
});

function submit() {
    if (isSubscribed.value === true) {
        questionStore.unsubscribe(question.value.id);
    } else {
        questionStore.subscribe(question.value.id);
    }
}
</script>
