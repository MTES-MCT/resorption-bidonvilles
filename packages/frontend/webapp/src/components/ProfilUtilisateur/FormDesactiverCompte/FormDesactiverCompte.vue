<template>
    <p class="font-bold">
        Désactiver un compte
        <span class="font-italic">Résorption-bidonvilles</span>
    </p>
    <p>
        Si vous n'intervenez plus sur la question des bidonvilles et squats en
        France, vous pouvez alors désactiver votre compte en cliquant sur le
        bouton ci-dessous.
    </p>
    <p class="mt-2">
        Vous n'aurez plus accès à la plateforme ni ne serez sollicité(e) par
        courriel.
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
            >{{
                self ? "Désactiver mon compte" : "Désactiver ce compte"
            }}</Button
        >
    </p>
    <ErrorSummary v-if="error" class="mt-6" :message="error" />
</template>

<script setup>
import { defineProps, ref, toRefs, computed } from "vue";
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
const userStore = useUserStore();
const self = computed(() => {
    return user.value.id === userStore.user?.id;
});

function confirmDeactivation() {
    const wording = ["Êtes-vous sûr de vouloir désactiver le compte ?"];
    if (self.value === true) {
        wording.push("Vous serez automatiquement déconnecté(e).");
    }

    if (confirm(wording.join(" "))) {
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
        await deactivateUser(user.value.id);

        if (self.value === true) {
            userStore.signout();
            notificationStore.info(
                "Désactivation réussie",
                "Votre compte a bien été désactivé"
            );
            router.push("/compte-desactive");
        } else {
            notificationStore.info(
                "Désactivation réussie",
                "Le compte a bien été désactivé"
            );
            router.push(`/acces/${encodeURI(user.value.id)}`);
        }
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue.";
    }

    isLoading.value = false;
}
</script>
