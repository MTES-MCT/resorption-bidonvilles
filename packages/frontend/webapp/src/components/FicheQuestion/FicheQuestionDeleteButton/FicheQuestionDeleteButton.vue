<template>
    <Button
        v-if="userStore.user.is_superuser"
        icon="trash"
        iconPosition="left"
        type="button"
        variant="primary"
        :loading="isLoading"
        @click="submit"
        class="flex-shrink-0"
        >Supprimer la question</Button
    >
</template>

<script setup>
import { toRefs, ref } from "vue";
import { Button } from "@resorptionbidonvilles/ui";
import { useUserStore } from "@/stores/user.store";
import { useQuestionsStore } from "@/stores/questions.store";
import { useNotificationStore } from "@/stores/notification.store";

const props = defineProps({
    question: {
        type: Object,
        required: true,
    },
});

const userStore = useUserStore();
const error = ref(null);
const isLoading = ref(null);

const emit = defineEmits(["showModale"]);

async function submit() {
    const notificationStore = useNotificationStore();
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;

    try {
        emit("showModale");
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
        notificationStore.error(
            "Suppression de la question échouée",
            `Une erreur a eu lieu lors de la suppression de la question:\r${error.value}`
        );
    }

    isLoading.value = false;
}
</script>
