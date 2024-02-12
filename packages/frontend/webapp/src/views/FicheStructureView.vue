<template>
    <LayoutCommunaute :paddingTop="organization !== null">
        <Loading v-if="isLoading !== false" class="mt-16" />
        <ViewError v-else-if="error !== null || organization === null">
            <template v-slot:title>Fiche de structure inaccessible</template>
            <template v-slot:code>{{
                error || "Structure introuvable"
            }}</template>
            <template v-slot:content
                >Vous souhaitiez consulter la fiche d'une structure, mais nous
                ne parvenons pas à collecter les informations nécessaires. Vous
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
        </ViewError>

        <template v-else>
            <ContentWrapper>
                <FilArianne :items="ariane" class="mb-8" />
            </ContentWrapper>
            <FicheStructure :organization="organization" />
        </template>
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted, computed, watch, ref } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import router, { setDocumentTitle } from "@/helpers/router";
import { create as registerDirectoryView } from "@/api/directory_views.api";

import { Button, ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import ViewError from "@/components/ViewError/ViewError.vue";
import Loading from "@/components/Loading/Loading.vue";
import FicheStructure from "@/components/FicheStructure/FicheStructure.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";

const directoryStore = useDirectoryStore();
const organizationId = computed(() => {
    return router.currentRoute.value.params.id;
});
const isLoading = ref(false);
const error = ref(null);
const organization = ref(null);
const ariane = computed(() => [
    { label: "Accueil", to: "/" },
    { label: "Entraide", to: "/communaute" },
    { label: "Annuaire", to: "/annuaire" },
    { label: organization.value?.name || "..." },
]);

watch(organization, () => {
    if (organization.value !== null) {
        registerView();
    }
});

onMounted(load);

async function load() {
    if (isLoading.value === true) {
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        organization.value = await directoryStore.get(organizationId.value);

        if (organization.value) {
            setDocumentTitle(
                `${router.currentRoute.value.meta.title} — ${organization.value.name}`
            );
            registerView();
        }
    } catch (error) {
        error.value = error?.user_message || "Une erreur inconnue est survenue";
    }

    isLoading.value = false;
}

function registerView() {
    registerDirectoryView(organizationId.value);
}
</script>
