<template>
    <Modal closeWhenClickOutside @close="onClose" ref="modale">
        <template v-slot:title> Modification de votre message </template>

        <template v-slot:body>
            <div class="text-G700 text-sm mb-1 italic">
                Votre message original:
            </div>
            <CarteCommentaire
                :showUpdate="false"
                :comment="comment"
                class="bg-G100 p-6 border-1 max-w-2xl"
            />

            <div class="mt-6">
                <DsfrInput
                    :disabled="loading"
                    label="Modifiez votre message:"
                    :labelVisible="true"
                    v-model="description"
                    :isTextarea="true"
                />
            </div>
            <ErrorSummary v-if="error" :message="error" class="mb-0 mt-6" />
        </template>

        <template v-slot:footer>
            <DsfrButton
                secondary
                @click="() => modale.close()"
                label="Annuler"
            />

            <DsfrButton
                class="ml-5"
                :loading="loading"
                @click="update"
                :disabled="isTextSimilar"
                label="Enregistrer"
            />
        </template>
    </Modal>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import { useActionsStore } from "@/stores/actions.store";
import { ErrorSummary, Modal } from "@resorptionbidonvilles/ui";

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
const description = ref(comment.value.description);
const isTextSimilar = computed(() => {
    return description.value === comment.value.description;
});
const reset = () => {
    loading.value = false;
    error.value = null;
    description.value = comment.value.description;
};

const onClose = () => {
    reset();
};

const update = async () => {
    if (loading.value === true) {
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        console.log("update", commentType.value);
        const notificationStore = useNotificationStore();
        let selectedStore;
        let sourceId;
        if (commentType.value === "shantytown") {
            selectedStore = useTownsStore();
            sourceId = comment.value.shantytown;
        } else {
            selectedStore = useActionsStore();
            sourceId = comment.value.actionId;
        }
        console.log("Selected Store:", selectedStore);

        await selectedStore.updateOwnComment(
            sourceId,
            comment.value.id,
            description.value
        );

        notificationStore.success(
            "Message modifié",
            "Votre message a bien été modifié"
        );
        modale.value.close();
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    loading.value = false;
};
</script>
