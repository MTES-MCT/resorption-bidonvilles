<template>
    <div v-if="error" class="bg-red200 p-3 mb-8">
        {{ error }}
    </div>
    <FormPublic :schema="schema" :submit="submit" v-else>
        <template v-slot:title>Activer mon compte </template>
        <template v-slot:body>
            <FormActivationCompteInputEmail v-model="email" />
            <FormActivationCompteInputPassword :showMandatoryStar="true" />
            <PasswordInfo />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <Button type="submit">Activer mon compte </Button>
            </p></template
        >
    </FormPublic>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";

import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormActivationCompteInputEmail from "./inputs/FormActivationCompteInputEmail.vue";
import FormActivationCompteInputPassword from "./inputs/FormActivationCompteInputPassword.vue";
import { Button, PasswordInfo } from "@resorptionbidonvilles/ui";
import router from "@/helpers/router";
import { trackEvent } from "@/helpers/matomo.js";
import { useNotificationStore } from "@/stores/notification.store";

import { checkActivationToken, activate } from "@/api/users.api.js";

import schema from "./FormActivationCompte.schema";

const error = ref(null);
const user = ref(null);
const email = ref("");

async function load() {
    try {
        user.value = await checkActivationToken(
            router.currentRoute.value.params.token
        );
        email.value = user.value.email;
    } catch (err) {
        error.value = err.user_message;
    }
}

async function submit(values) {
    await activate(user.value.id, {
        email: values.email,
        password: values.password,
        token: router.currentRoute.value.params.token,
    });
    trackEvent("Demande d'accès", "Création compte");

    router.push({ path: "/" });
    const notificationStore = useNotificationStore();
    notificationStore.success(
        "Compte activé",
        "Vous pouvez désormais vous connecter à la plateforme"
    );
}

onBeforeMount(() => {
    load();
});
</script>
