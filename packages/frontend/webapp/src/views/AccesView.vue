<template>
    <LayoutLoading v-if="isLoading !== false"></LayoutLoading>

    <LayoutError v-else-if="error !== null || enrichedUser === null">
        <template v-slot:title>Fiche d'accès inaccessible</template>
        <template v-slot:code>{{
            error !== null ? error : "Utilisateur supprimé"
        }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter la fiche d'accès d'un utilisateur, mais
            nous ne parvenons pas à collecter les informations nécessaires. Vous
            pouvez réessayer un peu plus tard ou nous contacter en cas
            d'urgence.</template
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

    <Layout v-else>
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
            <FicheAcces :user="enrichedUser" />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useAccesStore } from "@/stores/acces.store.js";
import router, { setDocumentTitle } from "@/helpers/router";
import enrichUserWithLocationName from "@/utils/enrichUserWithLocationName";

import { Button, ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import FicheAcces from "@/components/FicheAcces/FicheAcces.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const ariane = [
    { label: "Accueil", to: "/" },
    { label: "Administration", to: "/acces" },
    { label: "Fiche utilisateur" },
];
const accesStore = useAccesStore();
const isLoading = ref(null);
const error = ref(null);
let userRef = null;
const enrichedUser = computed(() => {
    return userRef !== null && userRef.value !== null
        ? enrichUserWithLocationName(userRef.value)
        : null;
});

onMounted(load);

const userId = computed(() => {
    return router.currentRoute.value.params.id;
});

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        userRef = await accesStore.fetchUser(userId.value, true);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${userRef.value.last_name} ${userRef.value.first_name}`
        );
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
