<template>
    <LayoutLoading hero v-if="isLoading !== false" />

    <LayoutError hero v-else-if="error">
        <template v-slot:title>Votre identification a échoué</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content>
            <p>
                Vous souhaitiez changer le mot de passe associé à votre compte
                <em class="italic">Résorption-bidonvilles</em> mais nous ne
                parvenons pas à vous identifier.
            </p>
            <p class="mt-4">
                Il est possible que vous ayez utilisé un lien expiré, auquel cas
                il vous suffit de demander un nouveau lien.
            </p>
        </template>
        <template v-slot:actions>
            <Button
                type="button"
                @clicked="router.push('/nouveau-mot-de-passe')"
                >Demander un nouveau lien</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <Layout hero v-else>
        <FormChangementMotDePasse
            :email="user.email"
            :userId="user.id"
            :token="token"
        />
    </Layout>
</template>

<script setup>
// utils
import { onMounted, ref, computed } from "vue";
import { check } from "@/api/password_tokens.api";
import router from "@/helpers/router.js";

// components
import { Button } from "@resorptionbidonvilles/ui";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import Layout from "@/components/Layout/Layout.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import FormChangementMotDePasse from "@/components/FormChangementMotDePasse/FormChangementMotDePasse.vue";

const isLoading = ref(null);
const error = ref(null);
const user = ref(null);
onMounted(load);

const token = computed(() => {
    return router.currentRoute.value.params.token;
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    if (!token.value) {
        error.value = "Jeton d'identification manquant";
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        user.value = await check(token.value);
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
