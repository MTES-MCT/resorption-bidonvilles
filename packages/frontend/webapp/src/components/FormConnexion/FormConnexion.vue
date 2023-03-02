<template>
    <ContentWrapper size="medium" class="mb-10" v-if="message !== null">
        <p class="bg-red200 p-4 flex items-center justify-center space-x-2">
            <Icon icon="circle-info" class="text-red600" />
            <span>{{ message }}</span>
        </p>
    </ContentWrapper>
    <FormPublic
        :schema="schema"
        :submit="submit"
        size="small"
        :showErrorSummary="false"
    >
        <template v-slot:title
            >Connectez-vous à<br />Résorption-bidonvilles</template
        >

        <template v-slot:body>
            <FormConnexionInputEmail />
            <FormConnexionInputPassword />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <Button type="submit">Me connecter</Button>
            </p>
        </template>

        <template v-slot:footer>
            <p
                class="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:justify-center sm:space-x-6"
            >
                <Link to="/contact">Demander un accès</Link>
                <Link to="/nouveau-mot-de-passe">Mot de passe oublié</Link>
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
// vue
import { computed, defineProps, toRefs } from "vue";

// utils
import router from "@/helpers/router.js";
import { trackEvent } from "@/helpers/matomo.js";

// components
import { Button, Link, Icon } from "@resorptionbidonvilles/ui";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper.vue";
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormConnexionInputEmail from "./inputs/FormConnexionInputEmail.vue";
import FormConnexionInputPassword from "./inputs/FormConnexionInputPassword.vue";

// form
import schema from "./FormConnexion.schema.js";

// stores and api
import { useUserStore } from "@/stores/user.store.js";
const userStore = useUserStore();

// reason: raison pour laquelle l'utilisateur est redirigé vers la page de connexion
const props = defineProps({
    reason: {
        type: String,
        required: false,
    },
});

const { reason } = toRefs(props);

// methods
async function submit({ email, password }) {
    await userStore.signin(email, password);
    trackEvent("Login", "Connection");
    router.push("/chargement");
}

const message = computed(() => {
    if (reason.value && reason.value.length > 0) {
        return "Votre session est expirée, veuillez-vous reconnecter";
    }
    return "Veuillez vous connecter pour accéder à la page demandée";
});
</script>
