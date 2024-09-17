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
            <FormConnexionBandeauChangementAdresse />
        </template>

        <template v-slot:body>
            <FormConnexionMessageAlerte
                v-if="isFormDisabled"
                :delayBeforeReactivation="delayBeforeReactivation"
            />
            <FormConnexionInputEmail
                :disabled="isFormDisabled"
                aria-label="Veuillez saisir l'adresse de messagerie correspondant à votre identifiant sur la plateforme"
            />
            <FormConnexionInputPassword
                :disabled="isFormDisabled"
                aria-label="Veuillez saisir votre mot de passe"
            />
        </template>

        <template v-slot:button>
            <p class="text-center">
                <Button
                    type="submit"
                    aria-label="Valider les informations saisies,"
                    :disabled="isFormDisabled"
                    >Me connecter</Button
                >
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
import { computed, defineProps, toRefs, watch, ref, onMounted } from "vue";

// utils
import router from "@/helpers/router.js";
import { trackEvent } from "@/helpers/matomo.js";

// components
import { Button, ContentWrapper, Link, Icon } from "@resorptionbidonvilles/ui";
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormConnexionInputEmail from "./inputs/FormConnexionInputEmail.vue";
import FormConnexionInputPassword from "./inputs/FormConnexionInputPassword.vue";
import FormConnexionBandeauChangementAdresse from "./FormConnexionBandeauChangementAdresse.vue";
import FormConnexionMessageAlerte from "./FormConnexionMessageAlerte.vue";

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
const blockedTimer = ref(localStorage.getItem("blockedTimer"));
const isFormDisabled = ref(false);
const delayBeforeReactivation = ref(null);
const timeoutReactivation = ref(null);

watch(isFormDisabled, (newVal) => {
    if (newVal === true) {
        timerReactivation();
    } else {
        localStorage.removeItem("connexionCounter");
        localStorage.removeItem("blockedTimer");
        clearTimeout(timeoutReactivation.value);
    }
});

const timerReactivation = () => {
    timeoutReactivation.value = setTimeout(() => {
        isFormDisabled.value = false;
    }, delayBeforeReactivation.value);
};

// methods
async function submit({ email, password }) {
    try {
        await userStore.signin(email, password);
    } catch (error) {
        checkAttempt();
        throw error;
    }
    resetConnexionAttempts();
    trackEvent("Login", "Connection");
    router.push("/chargement");
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

const checkAttempt = () => {
    if (!localStorage.getItem("connexionCounter")) {
        localStorage.setItem("connexionCounter", 1);
    } else {
        let counter = parseInt(localStorage.getItem("connexionCounter"));
        counter++;
        localStorage.setItem("connexionCounter", counter);
        if (counter >= 3) {
            const now = Date.now();
            const blockedTimer = now + 900000;
            localStorage.setItem("blockedTimer", blockedTimer);
            delayBeforeReactivation.value = parseInt(
                localStorage.getItem("blockedTimer") - Date.now()
            );
            isFormDisabled.value = true;
            return false;
        }
    }
    return false;
};

const resetConnexionAttempts = () => {
    isFormDisabled.value = false;
};

onMounted(() => {
    if (blockedTimer.value > Date.now()) {
        isFormDisabled.value = true;
        delayBeforeReactivation.value =
            parseInt(localStorage.getItem("blockedTimer")) - Date.now();
        timerReactivation();
    }
});
</script>
