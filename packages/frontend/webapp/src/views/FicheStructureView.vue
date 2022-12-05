<template>
    <LayoutLoading v-if="directoryStore.isLoading !== false"></LayoutLoading>

    <LayoutError
        v-else-if="directoryStore.error !== null || organization === null"
    >
        <template v-slot:title>Fiche de structure inaccessible</template>
        <template v-slot:code>{{
            directoryStore.error || "Structure introuvable"
        }}</template>
        <template v-slot:content
            >Vous souhaitiez consulter la fiche d'une structure, mais nous ne
            parvenons pas à collecter les informations nécessaires. Vous pouvez
            réessayer un peu plus tard ou nous contacter en cas
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
        <FicheStructure :organization="organization" />
    </Layout>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";
import router from "@/helpers/router";
import { registerDirectoryView } from "@/api/statistics.api";

import { Button } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import LayoutError from "@/components/LayoutError/LayoutError.vue";
import LayoutLoading from "@/components/LayoutLoading/LayoutLoading.vue";
import FicheStructure from "@/components/FicheStructure/FicheStructure.vue";
import ButtonContact from "@/components/ButtonContact/ButtonContact.vue";

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
