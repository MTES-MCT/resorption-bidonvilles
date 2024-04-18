<template>
    <form>
        <p class="bg-blue100 p-4 flex items-start space-x-2">
            <Icon icon="circle-info" class="text-primary" />
            <span
                >Vos identifiants de connexion sont votre email et votre mot de
                passe. Vous pouvez changer ce dernier en remplissant le
                formulaire ci-dessous.</span
            >
        </p>

        <!-- Email -->
        <p class="mt-5 font-bold">
            Votre email
            <Warning class="font-normal text-sm cursor-pointer" @click="contact"
                >Si vous souhaitez modifier cette information, merci de nous
                contacter</Warning
            >
        </p>
        {{ user.email }}

        <!-- autres champs modifiables -->
        <div class="max-w-lg mt-5">
            <FormIdentifiantsInputPassword
                :user="user"
                :disabled="passwordCheckBlocked"
            />
        </div>

        <Button type="submit" @click="onSubmit" :disabled="passwordCheckBlocked"
            >Sauvegarder</Button
        >
    </form>
</template>

<script setup>
// utils
import ENV from "@/helpers/env";
import { ref } from "vue";
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/user.store.js";
import { useNotificationStore } from "@/stores/notification.store.js";
import schema from "./FormIdentifiants.schema";
import { edit } from "@/api/me.api";
import router from "@/helpers/router";

// components
import { Button, Icon, Warning } from "@resorptionbidonvilles/ui";
import FormIdentifiantsInputPassword from "./inputs/FormIdentifiantsInputPassword.vue";

// data
const userStore = useUserStore();
const user = userStore.user;
const error = ref(null);
const passwordCheckAttempts = ref(0);
const passwordCheckBlocked = ref(false);
const passwordCheckBlockTime = ref(null);

const { handleSubmit, setErrors } = useForm({
    validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
    const notificationStore = useNotificationStore();
    error.value = null;
    if (passwordCheckBlocked.value) {
        const now = Date.now();
        const diff = Math.round((now - this.blockTime) / 1000);
        if (diff < 300) {
            notificationStore.error(
                "Changement de mot de passe bloqué",
                "Vous avez renseigné trop de fois un mot de passe incorrect. Le changement de mot de passe est bloqué pendant 5 minutes."
            );
            return;
        } else {
            passwordCheckBlocked.value = false;
            passwordCheckAttempts.value = 0;
            passwordCheckBlockTime.value = null;
        }
    }

    const passwordCheck = await userStore.checkActualPassword(
        userStore.user.email,
        values.actualPassword
    );

    if (passwordCheck.checkActualPassword === false) {
        passwordCheckAttempts.value++;
        if (passwordCheckAttempts.value >= 5) {
            passwordCheckBlocked.value = true;
            passwordCheckBlockTime.value = Date.now();
            notificationStore.error(
                "Changement de mot de passe bloqué",
                "Vous avez renseigné un mot de passe incorrect à de trop nombreuses reprises. Le changement de mot de passe est bloqué pendant 5 minutes."
            );
            return;
        } else {
            setErrors({
                actualPassword: "Mot de passe invalide",
            });
            notificationStore.error(
                "Mot de passe invalide",
                "Votre mot de passe actuel est invalide"
            );
            return;
        }
    } else {
        passwordCheckAttempts.value = 0;
        passwordCheckBlocked.value = false;
        passwordCheckBlockTime.value = null;

        try {
            await edit({ password: values.newPassword });
            notificationStore.success(
                "Vos identifiants",
                "Votre mot de passe a bien été modifié"
            );
            userStore.setPasswordConformity(true);
            router.push("/tableau-de-bord");
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }
});

function contact() {
    window.open(`mailto:${ENV.CONTACT_EMAIL}`);
}
</script>
