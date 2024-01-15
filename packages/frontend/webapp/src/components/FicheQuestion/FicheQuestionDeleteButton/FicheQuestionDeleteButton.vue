<template>
    <Button
        v-if="userStore.user.is_superuser"
        icon="trash"
        iconPosition="left"
        type="button"
        variant="primary"
        :loading="isLoading"
        @click="submit"
        >Supprimer la question</Button
    >
</template>

<script setup>
import { toRefs, ref } from "vue";
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
const error = ref(null);
const actionDelete = ref(null);
const isLoading = ref(null);

async function submit() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;

    try {
        actionDelete.value = await questionStore.deleteQuestion(
            question.value.id
        );
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
        alert(
            `Une erreur a eu lieu lors de la suppression de la question:\r${error.value}`
        );
    }

    isLoading.value = false;
}
</script>
