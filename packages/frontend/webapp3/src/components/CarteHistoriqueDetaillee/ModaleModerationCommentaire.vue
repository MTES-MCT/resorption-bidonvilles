<template>
    <Modal :isOpen="isOpen" @close="onClose">
        <template v-slot:title>
            Confirmez-vous la suppression du message ?
        </template>

        <template v-slot:body>
            <BlocCommentaire
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
            <div class="error text-error" v-if="error">{{ error }}</div>
        </template>

        <template v-slot:footer>
            <Button variant="primaryText" @click="isOpen = false"
                >Annuler</Button
            >
            <Button
                class="ml-5"
                variant="tertiary"
                :loading="loading"
                @click="remove"
                >Supprimer</Button
            >
        </template>
    </Modal>
</template>

<script setup>
import { defineProps, toRefs, ref, computed, defineExpose } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useActivitiesStore } from "@/stores/activities.store";
import { useTownsStore } from "@/stores/towns.store";
import { deleteComment } from "@/api/towns.api";
import { Button, Modal, TextArea } from "@resorptionbidonvilles/ui";

import BlocCommentaire from "../BlocCommentaire/BlocCommentaire.vue";

const configStore = useConfigStore();
const notificationStore = useNotificationStore();
const activitiesStore = useActivitiesStore();
const townsStore = useTownsStore();

const props = defineProps({
    comment: {
        type: Object,
    },
});

const { comment } = toRefs(props);

const loading = ref(false);
const isOpen = ref(false);
const error = ref(null);
const reason = ref("");

const isOwner = computed(() => {
    return comment.value.createdBy.id === configStore.config.user.id;
});

function onClose() {
    isOpen.value = false;
}

async function remove() {
    if (loading.value) {
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const { comments } = await deleteComment(
            comment.value.shantytown,
            comment.value.id,
            reason.value
        );

        reason.value = "";
        isOpen.value = false;
        notificationStore.success(
            "Message supprimé",
            !isOwner.value
                ? "L'auteur du message en a été notifié par mail"
                : ""
        );
        activitiesStore.removeComment(comment.value.id);
        townsStore.updateShantytownComments(comment.value.shantytown, comments);
    } catch (e) {
        error.value =
            (e && e.user_message) || "Une erreur inconnue est survenue";
    }

    loading.value = false;
}
defineExpose({
    open() {
        isOpen.value = true;
    },
});
</script>
