<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
        <template v-slot:title>
            Confirmez-vous la suppression du message ?
        </template>

        <template v-slot:body>
            <CarteCommentaire
                :comment="comment"
                class="bg-G100 p-6 border-1 max-w-2xl"
            />
            <div class="mt-6" v-if="!isOwner">
                <TextArea
                    :disabled="loading"
                    label="Pourquoi souhaitez-vous supprimer ce message ?"
                    v-model="reason"
                />
            </div>
            <ErrorSummary v-if="error" :message="error" class="mb-0 mt-6" />
        </template>

        <template v-slot:footer>
            <Button variant="primaryText" @click="() => modale.close()"
                >Annuler</Button
            >
            <Button class="ml-5" :loading="loading" @click="remove"
                >Supprimer</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useActionsStore } from "@/stores/actions.store"; // Assuming this store exists for action comments
import {
    Button,
    ErrorSummary,
    Modal,
    TextArea,
} from "@resorptionbidonvilles/ui";

import CarteCommentaire from "@/components/CarteCommentaire/CarteCommentaire.vue";

const props = defineProps({
    comment: {
        type: Object,
    },
    commentType: {
        type: String,
        default: "shantytown",
    },
});
const { comment, commentType } = toRefs(props);

const modale = ref(null);
const loading = ref(false);
const error = ref(null);
const reason = ref("");

const isOwner = computed(() => {
    const userStore = useUserStore();
    return comment.value.createdBy.id === userStore.user.id;
});

function reset() {
    loading.value = false;
    error.value = null;
    reason.value = "";
}

function onClose() {
    reset();
}

async function remove() {
    if (loading.value === true) {
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const notificationStore = useNotificationStore();
        const selectedStore =
            commentType.value === "shantytown"
                ? useTownsStore()
                : useActionsStore();
        const sourceId =
            commentType.value === "shantytown"
                ? comment.value.shantytown
                : comment.value.actionId;

        await selectedStore.deleteComment(
            sourceId,
            comment.value.id,
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
    }

    loading.value = false;
}
</script>
