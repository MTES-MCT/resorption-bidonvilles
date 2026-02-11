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
        <template v-slot:title>
            Connectez-vous à<br />Résorption-bidonvilles
        </template>

        <template v-slot:body>
            <FormConnexionInputEmail
                :disabled="isLoading"
                aria-label="Veuillez saisir l'adresse de messagerie correspondant à votre identifiant sur la plateforme"
            />
            <FormConnexionInputPassword
                :disabled="isLoading"
                aria-label="Veuillez saisir votre mot de passe"
            />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <DsfrButton
                    type="submit"
                    aria-label="Valider les informations saisies,"
                    :disabled="isLoading"
                    >Me connecter</DsfrButton
                >
            </p>
        </template>

        <template v-slot:footer>
            <p
                class="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:justify-center sm:space-x-6"
            >
                <DsfrButton
                    @click.prevent.stop="router.push('/contact')"
                    tertiary
                    no-outline
                    >Demander un accès</DsfrButton
                >
                <DsfrButton
                    @click.prevent.stop="router.push('/nouveau-mot-de-passe')"
                    tertiary
                    no-outline
                    >Mot de passe oublié</DsfrButton
                >
            </p>
        </template>
    </FormPublic>
</template>

<script setup>
// vue
import { computed, toRefs, ref } from "vue";

// utils
import router from "@/helpers/router.js";
import { trackEvent } from "@/helpers/matomo.js";

// components
import { ContentWrapper, Icon } from "@resorptionbidonvilles/ui";
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

// reason: raison pour laquelle l'utilisateur est redirigé vers la page de connexion
const props = defineProps({
    reason: {
        type: String,
        required: false,
    },
});

const { reason } = toRefs(props);
const isLoading = ref(false);

// methods
async function submit({ email, password }) {
    isLoading.value = true;
    try {
        await userStore.signin(email, password);
        trackEvent("Login", "Connection");
        setTimeout(() => {
            router.push("/chargement");
        }, 1000);
    } catch (error) {
        isLoading.value = false;
        throw error;
    }
}

const message = computed(() => {
    if (reason.value === "invalid_token") {
        return "Votre session est expirée, veuillez-vous reconnecter";
    }

    if (navigationStore.entrypoint) {
        return "Veuillez vous connecter pour accéder à la page demandée";
    }
    return null;
});
</script>
