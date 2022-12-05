<template>
    <ContentWrapper
        size="medium"
        class="mb-10"
        v-if="navigationStore.entrypoint"
    >
        <p class="bg-red200 p-4 flex items-center justify-center space-x-2">
            <Icon icon="circle-info" class="text-red600" />
            <span>Veuillez vous connecter pour accéder à la page demandée</span>
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
import { useNavigationStore } from "@/stores/navigation.store.js";
const userStore = useUserStore();
const navigationStore = useNavigationStore();

// methods
async function submit({ email, password }) {
    await userStore.signin(email, password);
    trackEvent("Login", "Connection");
    router.push("/chargement");
}
</script>
