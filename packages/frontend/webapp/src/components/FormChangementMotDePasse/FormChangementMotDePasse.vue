<template>
    <FormPublic :schema="schema" :submit="submit" :showErrorSummary="false">
        <template v-slot:title>Choisir un nouveau mot de passe</template>
        <template v-slot:description
            >Remplissez le formulaire ci-dessous pour changer le mot de passe de
            votre compte <em class="italic">Résorption-bidonvilles</em> :<br />
            <span class="font-bold">{{ email }}</span
            >.</template
        >

        <template v-slot:body>
            <FormChangementMotDePasseInputPassword />
            <FormChangementMotDePasseInputPasswordConfirm />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <DsfrButton type="submit">Changer mon mot de passe</DsfrButton>
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
// utils
import { defineProps, toRefs } from "vue";
import router from "@/helpers/router";

// components
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormChangementMotDePasseInputPassword from "./inputs/FormChangementMotDePasseInputPassword.vue";
import FormChangementMotDePasseInputPasswordConfirm from "./inputs/FormChangementMotDePasseInputPasswordConfirm.vue";

// form
import schema from "./FormChangementMotDePasse.schema.js";

// stores and api
import { setPassword } from "@/api/users.api.js";
import { useNotificationStore } from "@/stores/notification.store.js";

const props = defineProps({
    userId: {
        type: Number,
        required: true,
    },
    email: {
        type: Object,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});
const { userId, email, token } = toRefs(props);

// methods
async function submit(values) {
    await setPassword(userId.value, {
        email: email.value,
        password: values.password,
        token: token.value,
    });

    const notificationStore = useNotificationStore();
    notificationStore.info(
        "Mot de passe",
        "Votre mot de passe a bien été changé"
    );

    router.push("/connexion");
}
</script>
