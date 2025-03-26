<template>
    <ContentWrapper>
        <TabList :tabs="tabs" v-model="currentTab" class="mb-4 print:hidden" />
        <ListeDesSitesHeader />

        <Loading v-if="townsStore.isLoading !== false" />
        <ListeDesSitesErreur v-else-if="townsStore.error" />

        <template v-else>
            <ListeDesSitesStatistiques />
            <ListeDesSitesFiltres class="mt-4" />
            <ListeDesSitesListe
                class="mt-4"
                v-if="townsStore.filteredTowns.length > 0"
            />
            <ListeDesSitesVide v-else class="mt-10" />
        </template>
    </ContentWrapper>
</template>

<script setup>
import { computed, watch } from "vue";
import { useTownsStore } from "@/stores/towns.store";

import { ContentWrapper, TabList } from "@resorptionbidonvilles/ui";
import Loading from "@/components/Loading/Loading.vue";
import ListeDesSitesHeader from "./ListeDesSitesHeader.vue";
import ListeDesSitesStatistiques from "./ListeDesSitesStatistiques.vue";
import ListeDesSitesFiltres from "./ListeDesSitesFiltres.vue";
import ListeDesSitesErreur from "./ListeDesSitesErreur.vue";
import ListeDesSitesListe from "./ListeDesSitesListe.vue";
import ListeDesSitesVide from "./ListeDesSitesVide.vue";

const townsStore = useTownsStore();
const tabs = computed(() => [
    {
        id: "open",
        label:
            townsStore.prefilteredTowns.open.length <= 1
                ? "Site existant"
                : "Sites existants",
        total: townsStore.prefilteredTowns.open.length,
    },
    {
        id: "close",
        label:
            townsStore.prefilteredTowns.close.length <= 1
                ? "Site fermé"
                : "Sites fermés",
        total: townsStore.prefilteredTowns.close.length,
    },
]);
const currentTab = computed({
    get() {
        return townsStore.filters.status;
    },
    set(newValue) {
        townsStore.filters.status = newValue;
    },
});

watch(currentTab, () => {
    if (currentTab.value === "close") {
        townsStore.sort = "closedAt";
    } else {
        townsStore.sort = "lastUpdatedAt";
    }
});
</script>
