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
            <FormIdentifiantsInputPassword :user="user" />
        </div>

        <Button type="submit" @click="onSubmit">Sauvegarder</Button>
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

// components
import { Button, Icon, Warning } from "@resorptionbidonvilles/ui";
import FormIdentifiantsInputPassword from "./inputs/FormIdentifiantsInputPassword.vue";

// data
const userStore = useUserStore();
const user = userStore.user;
const error = ref(null);

const { handleSubmit, setErrors } = useForm({
    validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
    error.value = null;

    try {
        await edit(values);
        const notificationStore = useNotificationStore();
        notificationStore.success(
            "Vos identifiants",
            "Votre mot de passe a bien été modifié"
        );
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    }
});

function contact() {
    window.open(`mailto:${ENV.CONTACT_EMAIL}`);
}
</script>
