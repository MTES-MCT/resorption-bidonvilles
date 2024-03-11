<template>
    <FicheAccesBodySection class="mt-6">
        <template v-slot:title
            >Commentaires réservés aux administrateurs nationaux</template
        >
        <TextArea
            rows="5"
            label="Votre commentaire"
            info="(champ réservé aux administrateurs nationaux)"
            name="adminComments"
            v-model="adminComments"
            placeholder="Votre commentaire..."
            :disabled="isLoading"
        />
        <ErrorSummary v-if="error" :message="error" />
        <div class="flex items-center justify-end">
            <Button
                v-if="pendingAdminCommentsChanges"
                variant="primaryText"
                @click="cancelAdminComments"
                :disabled="isLoading"
                >Annuler mes changements</Button
            >
            <Button
                variant="tertiaryA11Yalt"
                @click="updateAdminComments"
                :disabled="!pendingAdminCommentsChanges"
                :loading="isLoading"
                >Sauvegarder</Button
            >
        </div>
    </FicheAccesBodySection>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { Button, ErrorSummary, TextArea } from "@resorptionbidonvilles/ui";
import { useNotificationStore } from "@/stores/notification.store";
import { setAdminComments } from "@/api/users.api";
import FicheAccesBodySection from "./FicheAccesBodySection.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const adminComments = ref(user.value.admin_comments || "");
const isLoading = ref(null);
const error = ref(null);
const pendingAdminCommentsChanges = computed(() => {
    return adminComments.value !== (user.value.admin_comments || "");
});

function cancelAdminComments() {
    adminComments.value = user.value.admin_comments || "";
}

async function updateAdminComments() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const notificationStore = useNotificationStore();
        await setAdminComments(user.value.id, adminComments.value);
        user.value.admin_comments = adminComments.value;
        notificationStore.success(
            "Commentaires administrateurs",
            "Votre commentaire a bien été sauvegardé"
        );
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}
</script>
