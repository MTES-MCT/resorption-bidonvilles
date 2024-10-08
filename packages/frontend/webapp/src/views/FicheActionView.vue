<template>
    <LayoutLoading v-if="isLoading !== false" />

    <LayoutError v-else-if="error !== null">
        <template v-slot:title>Fiche action inaccessible</template>
        <template v-slot:code>{{ error }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter la fiche détaillée d'une action, mais
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

    <Layout :paddingBottom="false" v-else>
        <ContentWrapper>
            <FilArianne :items="ariane" class="mb-8" />
        </ContentWrapper>
        <FicheAction :action="action" v-if="action" />
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useActionsStore } from "@/stores/actions.store.js";
import router, { setDocumentTitle } from "@/helpers/router";

import { Button, ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import FicheAction from "@/components/FicheAction/FicheAction.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

const actionsStore = useActionsStore();
const isLoading = ref(null);
const error = ref(null);
const action = computed(() => {
    return actionsStore.hash[actionId.value] || null;
});

const ariane = computed(() => [
    { label: "Accueil", to: "/" },
    { label: "Actions", to: "/liste-des-actions" },
    { label: action.value.name || "..." },
]);

const actionId = computed(() => {
    return parseInt(router.currentRoute.value.params.id, 10);
});

onMounted(load);
watch(actionId, load);

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        await actionsStore.fetchAction(actionId.value);
        setDocumentTitle(
            `${router.currentRoute.value.meta.title} — ${action.value.name}`
        );
    } catch (e) {
        error.value = e?.code || "Erreur inconnue";
    }

    isLoading.value = false;
}
</script>
