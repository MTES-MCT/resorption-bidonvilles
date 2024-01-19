<template>
    <Modal :isOpen="isOpen" closeWhenClickOutside @close="close">
        <template v-slot:title>
            Êtes-vous sûr de vouloir supprimer cette question ?
        </template>

        <template v-slot:body>
            {{ wording }}
            <ErrorSummary v-if="error" :message="error" class="mb-0 mt-6" />
        </template>

        <template v-slot:footer>
            <Button variant="primaryText" :loading="loading" @click="close"
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

const props = defineProps({
    author: {
        type: Object,
    },
    question: {
        type: Object,
    },
});

const { author, question } = toRefs(props);
const loading = ref(false);
const error = ref(null);
const isOpen = ref(false);
const notificationStore = useNotificationStore();
const questionStore = useQuestionsStore();

const wording = computed(() => {
    const baseWording = `Confirmez-vous la suppression de la question de
            ${author.value.first_name} ${author.value.last_name}`;
    return question.value.answers.length === 0
        ? `${baseWording} ?`
        : `${baseWording} ainsi que les ${question.value.answers.length} réponse(s) associée(s)?`;
});

function reset() {
    loading.value = false;
    error.value = null;
}

function close() {
    isOpen.value = false;
    reset();
}

async function remove() {
    if (loading.value === true) {
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        if (await questionStore.removeQuestion(question.value.id)) {
            setTimeout(() => {
                window.location.href = "/communaute";
            }, 1000);
        }
        notificationStore.success(
            "Suppression de la question réussie",
            "La question a bien été supprimée"
        );
    } catch (e) {
        notificationStore.error(
            "Suppression de la question échouée",
            error.value?.user_message || "Une erreur inconnue est survenue" // AJOUT .VALUE
        );
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        loading.value = false;
    }

    return true;
}

defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
