<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
        <template v-slot:title>
            Êtes-vous sûr de vouloir supprimer cette question ?
        </template>

        <template v-slot:body>
            {{ wording }}
            <ErrorSummary v-if="error" :message="error" class="mb-0 mt-6" />
        </template>

        <template v-slot:footer>
            <Button
                variant="primaryText"
                :loading="loading"
                class="!border-2 !border-primary hover:!bg-primaryDark hover:!text-white"
                @click="() => modale.close()"
                >Annuler</Button
            >
            <Button class="ml-5" :loading="loading" @click="remove"
                >Supprimer</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { Button, ErrorSummary, Modal } from "@resorptionbidonvilles/ui";
import { useNotificationStore } from "@/stores/notification.store";
import { useQuestionsStore } from "@/stores/questions.store";
import { useModaleStore } from "@/stores/modale.store";
import formatUserName from "@/utils/formatUserName";
import router from "@/helpers/router";

const props = defineProps({
    question: {
        type: Object,
    },
});

const { question } = toRefs(props);
const modale = ref(null);
const error = ref(null);
const notificationStore = useNotificationStore();
const questionStore = useQuestionsStore();
const loading = computed(() => {
    return questionStore.pendingDeletions[question.value.id] === true;
});

const wording = computed(() => {
    const baseWording = `Confirmez-vous la suppression de la question de ${formatUserName(
        question.value.createdBy,
        false
    )}`;
    return question.value.answers.length === 0
        ? `${baseWording} ?`
        : `${baseWording} ainsi que les ${question.value.answers.length} réponse(s) associée(s) ?`;
});

function reset() {
    error.value = null;
}

function onClose() {
    reset();
}

async function remove() {
    if (loading.value === true) {
        return;
    }

    error.value = null;

    try {
        const modaleStore = useModaleStore();
        await questionStore.removeQuestion(question.value.id);
        router.replace("/communaute");
        notificationStore.success(
            "Suppression de la question réussie",
            "La question a bien été supprimée"
        );
        modaleStore.close();
    } catch (e) {
        notificationStore.error(
            "Suppression de la question échouée",
            error.value?.user_message || "Une erreur inconnue est survenue"
        );
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    return true;
}
</script>
<style scoped>
button {
    border: inherit;
}
</style>
