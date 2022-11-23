<template>
    <LayoutLoading hero v-if="isLoading !== false"></LayoutLoading>

    <LayoutError hero v-else-if="error !== null">
        <template v-slot:title>Activation de votre accès impossible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez activer votre accès à la plateforme
            Résorption-bidonvilles mais nous ne parvenons pas à charger les
            données nécessaires. Vous pouvez rééssayer un peu plus tard ou nous
            contacter en cas d'urgence.</template
        >
        <template v-slot:actions>
            <Button
                icon="rotate-right"
                iconPosition="left"
                type="button"
                @click="load"
                >Réessayer</Button
            >
            <ButtonContact />
        </template>
    </LayoutError>

    <Layout hero v-else>
        <FormActivationCompte :user="user" />
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { check } from "@/api/activation_tokens.api";
import router from "@/helpers/router";

import { Button } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import FormActivationCompte from "@/components/FormActivationCompte/FormActivationCompte.vue";

const user = ref(null);
const isLoading = ref(null);
const error = ref(null);
onMounted(load);

const token = computed(() => {
    return router.currentRoute.value.params.token;
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        user.value = await check(token.value);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}
</script>
