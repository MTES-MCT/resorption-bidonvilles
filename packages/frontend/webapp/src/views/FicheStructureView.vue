<template>
    <LayoutCommunaute :paddingTop="organization !== null">
        <Loading v-if="directoryStore.isLoading !== false" class="mt-16" />
        <ViewError
            v-else-if="directoryStore.error !== null || organization === null"
        >
            <template v-slot:title>Fiche de structure inaccessible</template>
            <template v-slot:code>{{
                directoryStore.error || "Structure introuvable"
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

        <FicheStructure v-else :organization="organization" />
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import router from "@/helpers/router";
import { registerDirectoryView } from "@/api/statistics.api";

import { Button } from "@resorptionbidonvilles/ui";
import ViewError from "@/components/ViewError/ViewError.vue";
import Loading from "@/components/Loading/Loading.vue";
import FicheStructure from "@/components/FicheStructure/FicheStructure.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";
import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";

const directoryStore = useDirectoryStore();
const organizationId = computed(() => {
    return router.currentRoute.value.params.id;
});
const organization = computed(() => {
    return (
        directoryStore.organizations.find(
            ({ id }) => id === parseInt(organizationId.value, 10)
        ) || null
    );
});
watch(organization, () => {
    if (organization.value !== null) {
        registerView();
    }
});

onMounted(() => {
    if (!directoryStore.isLoaded) {
        load();
    }

    if (organization.value !== null) {
        registerView();
    }
});

function load() {
    directoryStore.fetchDirectory();
}

function registerView() {
    registerDirectoryView(organizationId.value);
}
</script>
