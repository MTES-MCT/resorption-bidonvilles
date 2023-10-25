<template>
    <p class="font-bold">
        Désactiver mon compte
        <span class="font-italic">Résorption-bidonvilles</span>
    </p>
    <p>
        Si vous n'intervenez plus sur la question des bidonvilles et squats en
        France, vous pouvez alors désactiver votre compte en cliquant sur le
        bouton ci-dessous.
    </p>
    <p class="mt-2">
        Vous n'aurez plus accès à la plateforme ni ne serez sollicité(e) par
        courriel mais les données que vous avez saisies seront conservées.
    </p>
    <p class="mt-2 underline">
        Cette action est réversible uniquement sur demande à votre
        administrateur local.
    </p>

    <p class="mt-6">
        <Button
            type="button"
            variant="primary"
            icon="fa-regular fa-trash-alt"
            iconPosition="left"
            :loading="isLoading"
            @click="confirmDeactivation"
            >Désactiver mon compte</Button
        >
    </p>
    <ErrorSummary v-if="error" class="mt-6" :message="error" />
</template>

<script setup>
import { defineProps, ref, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useNotificationStore } from "@/stores/notification.store";
import { deactivateUser } from "@/api/users.api";
import router from "@/helpers/router";

import { Button, ErrorSummary } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);

const isLoading = ref(false);
let error = ref(null);

function confirmDeactivation() {
    if (
        confirm(
            "Êtes-vous sûr(e) de vouloir désactiver le compte ? Vous serez automatiquement déconnecté(e)."
        )
    ) {
        deactivate();
    }
}

async function deactivate() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const notificationStore = useNotificationStore();
        const userStore = useUserStore();

        await deactivateUser(user.value.id);

        userStore.signout();
        notificationStore.info(
            "Désactivation réussie",
            "Votre compte a bien été désactivé"
        );
        router.push("/compte-desactive");
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue.";
    }

    isLoading.value = false;
}
</script>
