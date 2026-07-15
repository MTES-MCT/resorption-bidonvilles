<template>
    <Layout>
        <ContentWrapper>
            <FilArianne :items="ariane" class="my-8" />
            <Annuaire />
        </ContentWrapper>
    </Layout>
</template>

<script setup>
import { onMounted } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";

import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import Layout from "@/components/Layout/Layout.vue";
import Annuaire from "@/components/Annuaire/Annuaire.vue";

const directoryStore = useDirectoryStore();
const ariane = [
    { label: "Accueil", to: "/" },
    { label: "Annuaire" },
];

onMounted(() => {
    if (!directoryStore.isLoaded) {
        load();
    }
});

function load() {
    directoryStore.fetchDirectory();
}
</script>
