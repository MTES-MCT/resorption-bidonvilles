<template>
    <LayoutCommunaute :paddingTop="false">
        <ContentWrapper>
            <FilArianne :items="ariane" class="my-8" />
            <Annuaire />
        </ContentWrapper>
    </LayoutCommunaute>
</template>

<script setup>
import { onMounted } from "vue";
import { useDirectoryStore } from "@/stores/directory.store";

import { ContentWrapper, FilArianne } from "@resorptionbidonvilles/ui";
import LayoutCommunaute from "@/components/LayoutCommunaute/LayoutCommunaute.vue";
import Annuaire from "@/components/Annuaire/Annuaire.vue";

const directoryStore = useDirectoryStore();
const ariane = [
    { label: "Accueil", to: "/" },
    { label: "Entraide", to: "/communaute" },
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
