<template>
    <FicheAccesBodySection>
        <template v-slot:title
            ><Icon icon="trash-alt" /> {{ wording.title }}</template
        >

        <p class="mb-6">{{ wording.description }}</p>

        <TextArea
            rows="5"
            label="Raison de la désactivation"
            info="Elle sera communiquée par courriel à l'utilisateur."
            name="reason"
            id="reason"
            v-model="deactivationReason"
            placeholder="Raison pour laquelle vous désactivez cet accès..."
            :disabled="isLoading"
        />
        <ErrorSummary v-if="error" :message="error" :summary="errorSummary" />
        <div class="flex items-center justify-end">
            <Button
                v-if="deactivationReason.length > 0"
                variant="primaryText"
                @click="cancelReason"
                :disabled="isLoading"
                >Annuler</Button
            >
            <Button
                variant="tertiaryA11Yalt"
                @click="deactivate"
                :disabled="deactivationReason.length === 0"
                :loading="isLoading"
                >{{ wording.button }}</Button
            >
        </div>
    </FicheAccesBodySection>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import {
    Button,
    ErrorSummary,
    Icon,
    TextArea,
} from "@resorptionbidonvilles/ui";
import { useAccesStore } from "@/stores/acces.store";
import { useNotificationStore } from "@/stores/notification.store";
import { deactivateUser } from "@/api/users.api";
import FicheAccesBodySection from "./FicheAccesBodySection.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const deactivationReason = ref("");
const isLoading = ref(null);
const error = ref(null);
const errorSummary = ref(null);
const wordings = {
    delete: {
        title: "Supprimer cette demande",
        description:
            "Cet utilisateur a déjà reçu un ou plusieurs accès désormais expirés. En supprimant cette demande, l'utilisateur apparaîtra dans la liste des accès dits \"Désactivés\" et ne pourra plus formuler de demande d'accès.",
        button: "Supprimer la demande d'accès",
    },
    deactivate: {
        title: "Désactiver cet accès",
        description:
            "En désactivant l'accès de cet utilisateur, ce dernier ne pourra plus se connecter à la plateforme. Les données qu'il a saisies seront cependant conservées et son accès pourra être réactivé ultérieurement sur simple demande.",
        button: "Désactiver l'accès",
    },
};
const wording = computed(() => {
    return user.value.status === "new" ? wordings.delete : wordings.deactivate;
});

function cancelReason() {
    deactivationReason.value = "";
}

async function deactivate() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    errorSummary.value = null;
    try {
        const notificationStore = useNotificationStore();
        const accesStore = useAccesStore();
        const updatedUser = await deactivateUser(
            user.value.id,
            deactivationReason.value
        );
        accesStore.updateUser(user.value.id, updatedUser);
        notificationStore.success(
            "Désactivation de l'accès",
            "L'accès de cet utilisateur a bien été supprimé"
        );
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

    isLoading.value = false;
}
</script>
