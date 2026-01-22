<template>
    <FormPublic :schema="schema" :submit="submit" :showErrorSummary="false">
        <template v-slot:title>Mot de passe oublié ?</template>
        <template v-slot:description
            >Pas d'inquiétude, nous allons vous envoyer la marche à suivre pour
            renouveler votre mot de passe par courriel.<br />
            Le délai de réception du courriel peut prendre jusqu'à 15
            minutes.</template
        >

        <template v-slot:body>
            <FormMotDePasseOublieInputEmail />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <Button type="submit">Renouveler mon mot de passe</Button>
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
// utils
import router from "@/helpers/router";

// components
import { Button } from "@resorptionbidonvilles/ui";
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormMotDePasseOublieInputEmail from "./inputs/FormMotDePasseOublieInputEmail.vue";

// form
import schema from "./FormMotDePasseOublie.schema.js";

// stores and api
import { newPassword } from "@/api/users.api.js";
import { useNotificationStore } from "@/stores/notification.store.js";

// methods
async function submit(values) {
    await newPassword(values.email);

    const notificationStore = useNotificationStore();
    notificationStore.info(
        "Renouvellement de mot de passe",
        "Un courriel vous a été adressé avec les instructions"
    );

    router.push("/");
}
</script>
