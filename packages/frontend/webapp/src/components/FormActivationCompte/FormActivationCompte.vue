<template>
    <FormPublic :schema="schema" :submit="submit">
        <template v-slot:title>Activer mon compte </template>
        <template v-slot:body>
            <FormActivationCompteInputEmail v-model="email" />
            <FormActivationCompteInputPassword :user="user" />
            <FormActivationCompteInputPasswordConfirm />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <DsfrButton type="submit">Activer mon compte</DsfrButton>
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import router from "@/helpers/router";
import { trackEvent } from "@/helpers/matomo.js";
import { useNotificationStore } from "@/stores/notification.store";
import { activate } from "@/api/users.api.js";
import schema from "./FormActivationCompte.schema";

import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormActivationCompteInputEmail from "./inputs/FormActivationCompteInputEmail.vue";
import FormActivationCompteInputPassword from "./inputs/FormActivationCompteInputPassword.vue";
import FormActivationCompteInputPasswordConfirm from "./inputs/FormActivationCompteInputPasswordConfirm.vue";

const props = defineProps({
    user: Object,
});
const { user } = toRefs(props);
const email = computed({
    get() {
        return user.value.email;
    },
    set() {
        // ignore
    },
});

async function submit(values) {
    const notificationStore = useNotificationStore();

    await activate(user.value.id, {
        email: values.email,
        password: values.password,
        token: router.currentRoute.value.params.token,
    });
    trackEvent("Demande d'accès", "Création compte");

    router.push("/connexion");
    notificationStore.success(
        "Compte activé",
        "Vous pouvez désormais vous connecter à la plateforme"
    );
}
</script>
