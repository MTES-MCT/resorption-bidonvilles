<template>
    <Modal closeWhenClickOutside ref="modale">
        <template v-slot:title
            >Confirmez-vous la suppression de ce message ?</template
        >
        <template v-slot:body>
            <CarteCommentaire
                :comment="answer"
                class="bg-G100 p-6 border-1 max-w-2xl"
            />
            <div class="mt-6" v-if="!isOwner">
                <TextArea
                    :disabled="loading"
                    label="Pourquoi souhaitez-vous supprimer ce message ?"
                    v-model="reason"
                />
            </div>
            <ErrorSummary
                v-if="error"
                :message="error"
                :summary="errorSummary"
                class="mb-0 mt-6"
            />
        </template>

        <template v-slot:footer>
            <Button
                variant="primaryText"
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
import { computed, ref, toRefs } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import { useQuestionsStore } from "@/stores/questions.store";
import { useUserStore } from "@/stores/user.store";

import {
    Modal,
    Button,
    ErrorSummary,
    TextArea,
} from "@resorptionbidonvilles/ui";
import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";

const props = defineProps({
    questionId: {
        type: Number,
        required: true,
    },
    answer: {
        type: Object,
        required: true,
    },
});
const { answer, questionId } = toRefs(props);

const modale = ref(null);

const loading = ref(false);
const error = ref(null);
const errorSummary = ref({});
const reason = ref("");

const isOwner = computed(() => {
    const userStore = useUserStore();
    return answer.value.createdBy.id === userStore.user.id;
});

async function remove() {
    if (loading.value === true) {
        return;
    }

    loading.value = true;
    error.value = null;
    errorSummary.value = {};
    try {
        const notificationStore = useNotificationStore();
        const questionStore = useQuestionsStore();
        await questionStore.deleteAnswer(
            questionId.value,
            answer.value.id,
            reason.value
        );

        notificationStore.success(
            "Message supprimé",
            !isOwner.value
                ? "L'auteur du message en a été notifié par mail"
                : "Votre message a bien été supprimé"
        );
        modale.value.close();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields && Object.keys(e.fields).length > 0) {
            errorSummary.value = Object.keys(e.fields).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: e.fields[key][0],
                }),
                {}
            );
        }
    }

    loading.value = false;
}
</script>
<style scoped>
button {
    border: inherit;
}
</style>
